#!/usr/bin/env bash

# TODO
#===================
# improve the --packages option
# -> should update PACKAGES and ALL_PACKAGES -> limit scope of build
# add banner to all relevant files
# remove config-stark exclude once gone
# make sure fonts and images are not touched by addBanners

set -u -e -o pipefail

readonly currentDir=$(cd $(dirname $0); pwd)
# TODO review
source ${currentDir}/scripts/ci/_travis-fold.sh

source ${currentDir}/build-functions.sh

cd ${currentDir}

# List of all packages, separated by a space
# Packages will be transpiled using NGC (unless if also part of NODE_PACKAGES like the build package)
PACKAGES=(stark-core)

# Packages that should not be compiled by NGC but just with TSC
TSC_PACKAGES=(stark-core)

# Packages that should not be compiled at all
NODE_PACKAGES=(stark-build)

ALL_PACKAGES=(stark-build stark-core)

BUILD_ALL=true
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')" # last commit id
COMPILE_SOURCE=true
TYPECHECK_ALL=true

VERBOSE=false
TRACE=false

PROJECT_ROOT_DIR=`pwd`
ROOT_DIR=${PROJECT_ROOT_DIR}/packages
logTrace "Root dir: $ROOT_DIR"

export NODE_PATH=${NODE_PATH:-}:${currentDir}/node_modules

for ARG in "$@"; do
  case "$ARG" in
    --quick-bundle=*)
      COMPILE_SOURCE=false
      TYPECHECK_ALL=false
      ;;
    --packages=*)
      # asked to build a subset of the packages
      BUILD_ALL=false
      
      # parse to identify the packages to build
      PACKAGES_STR=${ARG#--packages=}
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
      IFS=$OLD_IFS # restore IFS
      
      unset PACKAGES_STR # not needed anymore
      #echo "Packages to build: ${PACKAGES_TO_BUILD[*]}"
      
      # Filtering package lists to only keep those that need to be built
      FILTERED_PACKAGES=()
      FILTERED_TSC_PACKAGES=()
      FILTERED_NODE_PACKAGES=()
      FILTERED_ALL_PACKAGES=()
      
      for target in "${PACKAGES_TO_BUILD[@]}"; do
        if containsElement "${target}" "${PACKAGES[@]}"; then
          FILTERED_PACKAGES+=(${target})
        fi
        if containsElement "${target}" "${TSC_PACKAGES[@]}"; then
          FILTERED_TSC_PACKAGES+=(${target})
        fi
        if containsElement "${target}" "${NODE_PACKAGES[@]}"; then
          FILTERED_NODE_PACKAGES+=(${target})
        fi
        if containsElement "${target}" "${ALL_PACKAGES[@]}"; then
          FILTERED_ALL_PACKAGES+=(${target})
        fi
      done
      PACKAGES=("${FILTERED_PACKAGES[@]}")
      TSC_PACKAGES=("${FILTERED_TSC_PACKAGES[@]}")
      NODE_PACKAGES=("${FILTERED_NODE_PACKAGES[@]}")
      ALL_PACKAGES=("${FILTERED_ALL_PACKAGES[@]}")
      
      # if ALL_PACKAGES is empty then the input was incorrect
      if [ ${#ALL_PACKAGES[@]} -eq 0 ]; then
        die "No matching packages. Can't build anything :("
      fi
      ;;
    --bundle=*)
      BUNDLE=( "${ARG#--bundle=}" )
      ;;
    --publish)
      VERSION_SUFFIX=""
      ;;
    --compile=*)
      COMPILE_SOURCE=${ARG#--compile=}
      ;;
    --typecheck=*)
      TYPECHECK_ALL=${ARG#--typecheck=}
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

TSC=`pwd`/node_modules/.bin/tsc
logTrace "TSC Path: $TSC"
NGC="node --max-old-space-size=3000 `pwd`/node_modules/@angular/compiler-cli/src/main"
UGLIFY=`pwd`/node_modules/.bin/uglifyjs
TSCONFIG=./tools/tsconfig.json
ROLLUP=`pwd`/node_modules/.bin/rollup

if [[ ${BUILD_ALL} == true && ${TYPECHECK_ALL} == true ]]; then
  travisFoldStart "clean dist" "no-xtrace"
    rm -rf ./dist/all/
    rm -rf ./dist/packages
  travisFoldEnd "clean dist"

  mkdir -p ./dist/all/

  TSCONFIG="packages/tsconfig.json"
  travisFoldStart "tsc -p ${TSCONFIG}" "no-xtrace"
    $TSC -p ${TSCONFIG}
  travisFoldEnd "tsc -p ${TSCONFIG}"
fi

if [[ ${BUILD_ALL} == true ]]; then
  rm -rf ./dist/packages
  if [[ ${BUNDLE} == true ]]; then
    rm -rf ./dist/packages-dist
  fi
  
  mkdir -p ./dist/packages-dist
fi

for PACKAGE in ${ALL_PACKAGES[@]}
do
  travisFoldStart "global build: ${PACKAGE}" "no-xtrace"
    SRC_DIR=${ROOT_DIR}/${PACKAGE}
    logTrace "SRC_DIR: $SRC_DIR" 1
    ROOT_OUT_DIR=${PROJECT_ROOT_DIR}/dist/packages
    logTrace "ROOT_OUT_DIR: $SRC_DIR" 1
    OUT_DIR=${ROOT_OUT_DIR}/${PACKAGE}
    logTrace "OUT_DIR: $OUT_DIR" 1
    NPM_DIR=${PROJECT_ROOT_DIR}/dist/packages-dist/${PACKAGE}
    logTrace "NPM_DIR: $NPM_DIR" 1
    
    LICENSE_BANNER=${ROOT_DIR}/license-banner.txt
  
    if containsElement "${PACKAGE}" "${PACKAGES[@]}"; then
      travisFoldStart "build package: ${PACKAGE}" "no-xtrace"
        OUT_DIR_ESM5=${ROOT_OUT_DIR}/${PACKAGE}/esm5
        logTrace "OUT_DIR_ESM5: $OUT_DIR_ESM5" 1
        ESM2015_DIR=${NPM_DIR}/esm2015
        logTrace "ESM2015_DIR: $ESM2015_DIR" 1
        ESM5_DIR=${NPM_DIR}/esm5
        logTrace "ESM5_DIR: $ESM5_DIR" 1
        BUNDLES_DIR=${NPM_DIR}/bundles
        logTrace "BUNDLES_DIR: $BUNDLES_DIR" 1

        if [[ ${COMPILE_SOURCE} == true ]]; then
          rm -rf ${OUT_DIR}
          rm -f ${ROOT_OUT_DIR}/${PACKAGE}.js
    
          logInfo "Compile package $PACKAGE"
          compilePackage ${SRC_DIR} ${OUT_DIR} ${PACKAGE}
        fi
  
        if [[ ${BUNDLE} == true ]]; then
          logInfo "Bundle $PACKAGE ($SRC_DIR)"
    
          logDebug "Clean up ${NPM_DIR}" 1
          rm -rf ${NPM_DIR} && mkdir -p ${NPM_DIR}

          logInfo "Copy $PACKAGE typings from $OUT_DIR to $NPM_DIR"
          syncOptions=(-a --exclude="*.js" --exclude="*.js.map")   
          syncFiles $OUT_DIR $NPM_DIR "${syncOptions[@]}"
       
          #cd $SRC_DIR > /dev/null
          logDebug "Rollup $PACKAGE" 1
          rollupIndex ${OUT_DIR} ${ESM2015_DIR} ${PACKAGE}

          logDebug "Produce ESM5 version" 1
          compilePackageES5 ${SRC_DIR} ${OUT_DIR_ESM5} ${PACKAGE}
          rollupIndex ${OUT_DIR_ESM5} ${ESM5_DIR} ${PACKAGE}

          logDebug "Run rollup conversions on $PACKAGE" 1
          runRollup ${SRC_DIR}
          addBanners ${BUNDLES_DIR}
          minify ${UGLIFY} ${BUNDLES_DIR}
        fi
        
        logInfo "Copy $PACKAGE package.json to $NPM_DIR"
        # FIXME exclude node modules!
        travisFoldStart "copy package.json for: ${PACKAGE}" "no-xtrace"
        syncOptions=(-am --include="package.json" --exclude="node_modules/" --exclude="rollup.config.js" --exclude="*.ts" --exclude="*/*.ts" --include="*" --exclude="*")
        syncFiles $SRC_DIR $NPM_DIR "${syncOptions[@]}"
        #cp $SRC_DIR/package.json $NPM_DIR/
        travisFoldEnd "copy package.json for: ${PACKAGE}"
      travisFoldEnd "build package: ${PACKAGE}"
    fi
    
    if containsElement "${PACKAGE}" "${NODE_PACKAGES[@]}"; then
      travisFoldStart "build node package: ${PACKAGE}" "no-xtrace"
      
      # contents only need to be copied to the destination folder
      logInfo "Copy ${PACKAGE} to ${OUT_DIR}"
      syncOptions=(-a --include="package-lock.json" --exclude="node_modules/" --exclude="config-stark/")
      syncFiles $SRC_DIR $OUT_DIR "${syncOptions[@]}"
  
      logInfo "Copy $PACKAGE contents"
      syncFiles $OUT_DIR $NPM_DIR "-a"
  
      travisFoldEnd "build node package: ${PACKAGE}"
    fi
  
    travisFoldStart "general tasks: ${PACKAGE}" "no-xtrace"
      if [[ -d ${NPM_DIR} ]]; then
        logInfo "Copy $PACKAGE README.md file to $NPM_DIR"
        cp ${ROOT_DIR}/README.md ${NPM_DIR}/
      
        logInfo "Update version references in ${NPM_DIR}"
        updateVersionReferences $VERSION ${NPM_DIR}
    
        logInfo "Update module name references in ${NPM_DIR}"
        updatePackageNameReferences ${PACKAGE} ${NPM_DIR}
    
        logInfo "Generate .npmignore file"
        generateNpmIgnore ${PROJECT_ROOT_DIR} ${NPM_DIR}
        
        logInfo "Generate npm package (tgz file)"
        generateNpmPackage ${NPM_DIR}
        
        logInfo "Adapt starter dependencies"
        adaptNpmPackageDependencies $PACKAGE $VERSION "./starter/package.json" 1

        # TODO Fix this with a proper solution
        if [[ $PACKAGE == "stark-build" ]]; then
          adaptNpmPackageDependencies $PACKAGE $VERSION "./packages/stark-core/package.json" 2
        fi
      fi
    travisFoldEnd "general tasks: ${PACKAGE}"
  
  travisFoldEnd "global build: ${PACKAGE}"
done

# Print return arrows as a log separator
travisFoldReturnArrows
