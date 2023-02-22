#!/usr/bin/env bash

# TODO
#===================
# add banner to all relevant files
# remove config-stark exclude once gone
# make sure fonts and images are not touched by addBanners

set -u -e -o pipefail

readonly currentDir=$(cd $(dirname $0); pwd)

export NODE_PATH=${NODE_PATH:-}:${currentDir}/node_modules

source ${currentDir}/scripts/ci/_ghactions-group.sh
source ${currentDir}/util-functions.sh
source ${currentDir}/build-functions.sh

cd ${currentDir}

# List of all packages, separated by a space
# Packages will be transpiled using NGC (unless if also part of NODE_PACKAGES like the build package)
PACKAGES=(stark-core stark-ui stark-rbac)

# Packages that should not be compiled by NGC but just with TSC
TSC_PACKAGES=()

# Packages that should not be compiled at all
NODE_PACKAGES=(stark-build stark-testing)

# We read from a file because the list is also shared with release-publish.sh
# Not using readarray because it does not handle \r\n
OLD_IFS=$IFS # save old IFS value
IFS=$'\r\n' GLOBIGNORE='*' command eval 'ALL_PACKAGES=($(cat ./modules.txt))'
IFS=${OLD_IFS} # restore IFS

BUILD_ALL=true
BUNDLE=true
COMPILE_SOURCE=true

GITHUB_ACTIONS=${GITHUB_ACTIONS:-}
GITHUB_EVENT_NAME=${GITHUB_EVENT_NAME:-""}
GH_ACTIONS_TAG=${GH_ACTIONS_TAG:-""}

VERBOSE=false
TRACE=false

for ARG in "$@"; do
  case "$ARG" in
    --quick-bundle=*)
      COMPILE_SOURCE=false
      ;;
    --packages=*)
      # asked to build a subset of the packages
      BUILD_ALL=false
      
      # parse to identify the packages to build
      PACKAGES_STR=${ARG#--packages=}
      PACKAGES_STR="${PACKAGES_STR//,/ }" # replace , by ' '
      PACKAGES_STR="${PACKAGES_STR//;/ }" # replace ; by ' '
      PACKAGES_STR="${PACKAGES_STR// /_}" # replace all spaces by '_'
      PACKAGES_STR=`eval echo ${PACKAGES_STR} | sed -r 's/[_]+/_/g'` # replace all '_' by ''
      PACKAGES_STR=`eval echo ${PACKAGES_STR} | sed -r 's/_$//g'` # replace last '_' if still there
      # at this point PACKAGES_STR is (finally) clean :)
      # it only contains '_' as delimiter
      
      # Convert the string to an array
      PACKAGES_TO_BUILD=()

      OLD_IFS=$IFS # save old IFS value
      IFS='_ ' # use '_' as character to split
      read -r -a PACKAGES_TO_BUILD <<< ${PACKAGES_STR}
      IFS=${OLD_IFS} # restore IFS
      
      unset PACKAGES_STR # not needed anymore
      #echo "Packages to build: ${PACKAGES_TO_BUILD[*]}"
      
      # Filtering package lists to only keep those that need to be built
      FILTERED_PACKAGES=()
      FILTERED_TSC_PACKAGES=()
      FILTERED_NODE_PACKAGES=()
      FILTERED_ALL_PACKAGES=()
      
      for target in "${PACKAGES_TO_BUILD[@]}"; do
        if [[ ${#PACKAGES[@]} > 0 && $(containsElement "${target}" "${PACKAGES[@]}"; echo $?) == 0 ]]; then
          FILTERED_PACKAGES+=(${target})
        fi
        if [[ ${#TSC_PACKAGES[@]} > 0 && $(containsElement "${target}" "${TSC_PACKAGES[@]}"; echo $?) == 0 ]]; then
          FILTERED_TSC_PACKAGES+=(${target})
        fi
        if [[ ${#NODE_PACKAGES[@]} > 0 && $(containsElement "${target}" "${NODE_PACKAGES[@]}"; echo $?) == 0 ]]; then
          FILTERED_NODE_PACKAGES+=(${target})
        fi
        if [[ ${#ALL_PACKAGES[@]} > 0 && $(containsElement "${target}" "${ALL_PACKAGES[@]}"; echo $?) == 0 ]]; then
          FILTERED_ALL_PACKAGES+=(${target})
        fi
      done
      [[ ${#FILTERED_PACKAGES[@]} > 0 ]] && PACKAGES=("${FILTERED_PACKAGES[@]}") || PACKAGES=()
      [[ ${#FILTERED_TSC_PACKAGES[@]} > 0 ]] && TSC_PACKAGES=("${FILTERED_TSC_PACKAGES[@]}") || TSC_PACKAGES=()
      [[ ${#FILTERED_NODE_PACKAGES[@]} > 0 ]] && NODE_PACKAGES=("${FILTERED_NODE_PACKAGES[@]}") || NODE_PACKAGES=()
      [[ ${#FILTERED_ALL_PACKAGES[@]} > 0 ]] && ALL_PACKAGES=("${FILTERED_ALL_PACKAGES[@]}") || ALL_PACKAGES=()
      
      # if ALL_PACKAGES is empty then the input was incorrect
      if [[ ${#ALL_PACKAGES[@]} == 0 ]]; then
        die "No matching packages. Can't build anything :("
      fi
      ;;
    --bundle=*)
      BUNDLE=( "${ARG#--bundle=}" )
      ;;
    --compile=*)
      COMPILE_SOURCE=${ARG#--compile=}
      ;;
    --verbose)
      logInfo "============================================="
      logInfo "Verbose mode enabled!"
      VERBOSE=true
      ;;
    --trace)
      logInfo "============================================="
      logInfo "Trace mode enabled!"
      TRACE=true
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

PROJECT_ROOT_DIR=`pwd`
logTrace "PROJECT_ROOT_DIR: ${PROJECT_ROOT_DIR}" 1
ROOT_DIR=${PROJECT_ROOT_DIR}/packages
logTrace "ROOT_DIR: ${ROOT_DIR}" 1
ROOT_OUT_DIR=${PROJECT_ROOT_DIR}/dist/packages
logTrace "ROOT_OUT_DIR: ${ROOT_OUT_DIR}" 1

if [[ ${GITHUB_EVENT_NAME} == "schedule" ]]; then
  logInfo "Nightly build initiated by GitHub Actions scheduled job. Using nightly version as version prefix!" 1
  VERSION_PREFIX=$(node -p "require('./package.json').config.nightlyVersion")
else
  logInfo "Normal build. Using current version as version prefix" 1
  VERSION_PREFIX=$(node -p "require('./package.json').version")
fi

if [[ ${GH_ACTIONS_TAG} == "" ]]; then
  logTrace "Setting the version suffix to the latest commit hash" 1
  VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')" # last commit id
  
  # Locally, we need to ensure the generated tgz file is different for each build
  if [[ ${GITHUB_ACTIONS} != true ]]; then
    VERSION_SUFFIX="${VERSION_SUFFIX}-$(date +%s)"
  fi
else
  logTrace "Build executed for a tag. Not using a version suffix!" 1
  VERSION_SUFFIX="" # no suffix
fi

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"

logInfo "============================================="
logInfo "Building Stark version ${VERSION}"
logInfo "============================================="

if [[ ${BUILD_ALL} == true ]]; then
  logInfo "> FULL build: ${ALL_PACKAGES[*]}"
else
  logInfo "> PARTIAL build: ${PACKAGES_TO_BUILD[*]}"
fi
logInfo "============================================="

NG=`pwd`/node_modules/.bin/ng

if [[ ${BUILD_ALL} == true ]]; then
  ghActionsGroupStart "clean dist" "no-xtrace"
  rm -rf ./dist/packages
  ghActionsGroupEnd "clean dist"
fi

if [[ ${BUILD_ALL} == true ]]; then
  rm -rf ./dist/packages
  if [[ ${BUNDLE} == true ]]; then
    rm -rf ./dist/packages-dist
  fi
  
  mkdir -p ./dist/packages-dist
fi

if [[ ${BUILD_ALL} == false ]]; then
  for PACKAGE in ${ALL_PACKAGES[@]}
  do
    ghActionsGroupStart "clean dist for ${PACKAGE}" "no-xtrace"

    rm -rf ./dist/packages/${PACKAGE}
    if [[ ${BUNDLE} == true ]]; then
      rm -rf ./dist/packages-dist/${PACKAGE}
    fi
    
    if [[ ! -d "./dist/packages" ]]; then
      mkdir -p ./dist/packages
    fi
    
    if [[ ! -d "./dist/packages-dist" ]]; then
      mkdir -p ./dist/packages-dist
    fi

    ghActionsGroupEnd "clean dist for ${PACKAGE}"
  done
fi

mkdir -p ${ROOT_OUT_DIR}

for PACKAGE in ${ALL_PACKAGES[@]}
do
  logInfo "============================================="
  logInfo "Global build: ${PACKAGE}"
  logInfo "============================================="
  
  SRC_DIR=${ROOT_DIR}/${PACKAGE}
  logTrace "SRC_DIR: $SRC_DIR" 1
  OUT_DIR=${ROOT_OUT_DIR}/${PACKAGE}
  logTrace "OUT_DIR: $OUT_DIR" 1
  NPM_DIR=${PROJECT_ROOT_DIR}/dist/packages-dist/${PACKAGE}
  logTrace "NPM_DIR: $NPM_DIR" 1
  
  LICENSE_BANNER=${ROOT_DIR}/license-banner.txt
  
  if [[ ${#PACKAGES[@]} > 0 && $(containsElement "${PACKAGE}" "${PACKAGES[@]}"; echo $?) == 0 ]]; then
    ghActionsGroupStart "build package: ${PACKAGE}" "no-xtrace"

    rm -rf ${OUT_DIR}
    rm -f ${ROOT_OUT_DIR}/${PACKAGE}.js
    
    OUT_DIR_ESM5=${ROOT_OUT_DIR}/${PACKAGE}/esm5
    logTrace "OUT_DIR_ESM5: $OUT_DIR_ESM5" 1
    ESM2015_DIR=${NPM_DIR}/esm2015
    logTrace "ESM2015_DIR: $ESM2015_DIR" 1
    FESM2015_DIR=${NPM_DIR}/fesm2015
    logTrace "FESM2015_DIR: $FESM2015_DIR" 1
    ESM5_DIR=${NPM_DIR}/esm5
    logTrace "ESM5_DIR: $ESM5_DIR" 1
    FESM5_DIR=${NPM_DIR}/fesm5
    logTrace "FESM5_DIR: $FESM5_DIR" 1
    BUNDLES_DIR=${NPM_DIR}/bundles
    logTrace "BUNDLES_DIR: $BUNDLES_DIR" 1

    logInfo "Compile package $PACKAGE"
    ngBuild ${PACKAGE}

    logInfo "Copy assets folders for package $PACKAGE"
    syncOptions=(-a --include="**/assets/" --exclude="*.js" --exclude="*.js.map" --exclude="*.ts" --exclude="/*.json" --exclude="testing/*.json" --include="*.json" --exclude="node_modules/" --exclude="coverage/" --exclude="reports/")
    syncFiles ${SRC_DIR} ${OUT_DIR} "${syncOptions[@]}"
    unset syncOptions

    logInfo "Copy typings folders for package $PACKAGE"
    syncOptions=(-a --include="/typings/***" --exclude="*")
    syncFiles ${SRC_DIR} ${OUT_DIR} "${syncOptions[@]}"
    unset syncOptions
    
    logDebug "Clean up ${NPM_DIR}" 1
    rm -rf ${NPM_DIR} && mkdir -p ${NPM_DIR}
    
    logInfo "Copy ${PACKAGE} files from ${OUT_DIR} to ${NPM_DIR}"
    syncOptions=(-a)
    syncFiles ${OUT_DIR} ${NPM_DIR} "${syncOptions[@]}"
    unset syncOptions
    
    addBanners ${FESM2015_DIR}
    addBanners ${FESM5_DIR}
    addBanners ${BUNDLES_DIR}
    
    ghActionsGroupEnd "build package: ${PACKAGE}"
  fi
    
  if [[ ${#NODE_PACKAGES[@]} > 0 && $(containsElement "${PACKAGE}" "${NODE_PACKAGES[@]}"; echo $?) == 0 ]]; then
    ghActionsGroupStart "build node package: ${PACKAGE}" "no-xtrace"
    
    # contents only need to be copied to the destination folder
    logInfo "Copy ${PACKAGE} to ${OUT_DIR}"
    syncOptions=(-a --include="package-lock.json" --exclude="node_modules/" --exclude="config-stark/")
    syncFiles ${SRC_DIR} ${OUT_DIR} "${syncOptions[@]}"
    unset syncOptions

    logInfo "Copy $PACKAGE contents"
    syncFiles ${OUT_DIR} ${NPM_DIR} "-a"
    
    ghActionsGroupEnd "build node package: ${PACKAGE}"
  fi
  
  ghActionsGroupStart "general tasks: ${PACKAGE}" "no-xtrace"
  if [[ -d ${NPM_DIR} ]]; then
    logInfo "Copy $PACKAGE README.md file to $NPM_DIR"
    cp ${ROOT_DIR}/README.md ${NPM_DIR}/
  
    logInfo "Update version references in ${NPM_DIR}"
    updateVersionReferences ${VERSION} ${NPM_DIR}

    logInfo "Update module name references in ${NPM_DIR}"
    updatePackageNameReferences ${PACKAGE} ${NPM_DIR}

    logInfo "Generate .npmignore file"
    generateNpmIgnore ${PROJECT_ROOT_DIR} ${NPM_DIR}
    
    logInfo "Generate npm package (tgz file)"
    generateNpmPackage ${NPM_DIR}
    
    logInfo "Adapt showcase dependencies"
    adaptNpmPackageDependencies ${PACKAGE} ${VERSION} "./showcase/package.json" 1
    adaptNpmPackageLockDependencies ${PACKAGE} ${VERSION} "./showcase/package-lock.json" 1
    
    logInfo "Adapt starter dependencies"
    adaptNpmPackageDependencies ${PACKAGE} ${VERSION} "./starter/package.json" 1
    adaptNpmPackageLockDependencies ${PACKAGE} ${VERSION} "./starter/package-lock.json" 1

  fi

  ghActionsGroupEnd "general tasks: ${PACKAGE}"
done

# Print return arrows as a log separator
ghActionsGroupReturnArrows
