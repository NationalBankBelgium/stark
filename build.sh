readonly currentDir=$(cd $(dirname $0); pwd)

# TODO(i): wrap into subshell, so that we don't pollute CWD, but not yet to minimize diff collision with Jason
cd ${currentDir}

PACKAGES=(build)

BUILD_ALL=true
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"
CONTRIBUTORS=$(node -p "require('./package.json').contributors")

# TODO Check build.sh script from angular for publish, compile, ...

#######################################
# Verifies a directory isn't in the ignored list
# Arguments:
#   param1 - Path to check
# Returns:
#   Boolean
#######################################
isIgnoredDirectory() {
  name=$(basename ${1})
  if [[ -f "${1}" || "${name}" == "src" || "${name}" == "test" || "${name}" == "integrationtest" || "${name}" == "locales" ]]; then
    return 0
  else
    return 1
  fi
}

#######################################
# Check if array contains an element
# Arguments:
#   param1 - Element to check
#   param2 - Array to look for element in
# Returns:
#   None
#######################################
containsElement () {
  local e
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done
  return 1
}

#######################################
# Recursively compile package
# Arguments:
#   param1 - Source directory
#   param2 - Out dir
#   param3 - Package Name
# Returns:
#   None
#######################################
compilePackage() {
  # For TSC_PACKAGES items
  if containsElement "${3}" "${TSC_PACKAGES[@]}"; then
    echo "======      [${3}]: COMPILING: ${TSC} -p ${1}/tsconfig-build.json"
    $TSC -p ${1}/tsconfig-build.json
  else
    echo "======      [${3}]: COMPILING: ${NGC} -p ${1}/tsconfig-build.json"
    local package_name=$(basename "${2}")
    $NGC -p ${1}/tsconfig-build.json
    if [[ "${package_name}" != "locales" ]]; then
      echo "======           Create ${1}/../${package_name}.d.ts re-export file for tsickle"
      echo "$(cat ${LICENSE_BANNER}) ${N} export * from './${package_name}/${package_name}'" > ${2}/../${package_name}.d.ts
      echo "{\"__symbolic\":\"module\",\"version\":3,\"metadata\":{},\"exports\":[{\"from\":\"./${package_name}/${package_name}\"}],\"flatModuleIndexRedirect\":true}" > ${2}/../${package_name}.metadata.json
    fi
  fi

  # Build subpackages
  for DIR in ${1}/* ; do
    [ -d "${DIR}" ] || continue
    BASE_DIR=$(basename "${DIR}")
    # Skip over directories that are not nested entry points
    [[ -e ${DIR}/tsconfig-build.json && "${BASE_DIR}" != "integrationtest" ]] || continue
    compilePackage ${DIR} ${2}/${BASE_DIR} ${3}
  done
}

#######################################
# Adds a package.json in directories where needed (secondary entry point typings).
# This is read by NGC to be able to find the flat module index.
# Arguments:
#   param1 - Source directory of typings files
# Returns:
#   None
#######################################
addNgcPackageJson() {
  for DIR in ${1}/* ; do
    [ -d "${DIR}" ] || continue
    # Confirm there is an ${PACKAGE}.d.ts and ${PACKAGE}.metadata.json file. If so, create
    # the package.json and recurse.
    if [[ -f ${DIR}/${PACKAGE}.d.ts && -f ${DIR}/${PACKAGE}.metadata.json ]]; then
      echo '{"typings": "${PACKAGE}.d.ts"}' > ${DIR}/package.json
      addNgcPackageJson ${DIR}
    fi
  done
}

updateVersionReferences() {
  NPM_DIR="$1"
  (
    echo "======      VERSION: Updating version references in ${NPM_DIR}"
    cd ${NPM_DIR}
    echo "======       EXECUTE: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
  )
}

for PACKAGE in ${PACKAGES[@]}
do
  PWD=`pwd`
  ROOT_DIR=${PWD}/packages
  SRC_DIR=${ROOT_DIR}/${PACKAGE}
  ROOT_OUT_DIR=${PWD}/dist/packages
  OUT_DIR=${ROOT_OUT_DIR}/${PACKAGE}
  NPM_DIR=${PWD}/dist/packages-dist/${PACKAGE}
  ESM5_DIR=${NPM_DIR}/esm5

  LICENSE_BANNER=${ROOT_DIR}/license-banner.txt

  if [[ ${COMPILE_SOURCE} == true ]]; then
    rm -rf ${OUT_DIR}
    rm -f ${ROOT_OUT_DIR}/${PACKAGE}.js
    compilePackage ${SRC_DIR} ${OUT_DIR} ${PACKAGE}
  fi

  if [[ ${BUNDLE} == true ]]; then
    echo "======      BUNDLING ${PACKAGE}: ${SRC_DIR} ====="
    rm -rf ${NPM_DIR} && mkdir -p ${NPM_DIR}

    if ! containsElement "${PACKAGE}" "${NODE_PACKAGES[@]}"; then

      echo "======        Copy ${PACKAGE} typings"
      rsync -a --exclude=*.js --exclude=*.js.map ${OUT_DIR}/ ${NPM_DIR}

      (
        cd  ${SRC_DIR}
        echo "======         Rollup ${PACKAGE}"
        rollupIndex ${OUT_DIR} ${ESM2015_DIR} ${PACKAGE}

        echo "======         Produce ESM5 version"
        compilePackageES5 ${SRC_DIR} ${OUT_DIR_ESM5} ${PACKAGE}
        rollupIndex ${OUT_DIR_ESM5} ${ESM5_DIR} ${PACKAGE}

        echo "======         Run rollup conversions on ${PACKAGE}"
        runRollup ${SRC_DIR}
        addBanners ${BUNDLES_DIR}
        minify ${BUNDLES_DIR}

        if [[ -e ${SRC_DIR}/build.sh ]]; then
          echo "======         Custom build for ${PACKAGE}"
          cd ${SRC_DIR} && ${SRC_DIR}/build.sh
        fi

      ) 2>&1 | grep -v "as external dependency"

      if [[ ${PACKAGE} == "common" ]]; then
        echo "======      Copy i18n locale data"
        rsync -a ${OUT_DIR}/locales/ ${NPM_DIR}/locales
      fi
    else
      echo "======        Copy ${PACKAGE} node tool"
      rsync -a ${OUT_DIR}/ ${NPM_DIR}
    fi

    echo "======        Copy ${PACKAGE} package.json and .externs.js files"
    rsync -am --include="package.json" --include="*/" --exclude=* ${SRC_DIR}/ ${NPM_DIR}/
    rsync -am --include="*.externs.js" --include="*/" --exclude=* ${SRC_DIR}/ ${NPM_DIR}/

    cp ${ROOT_DIR}/README.md ${NPM_DIR}/
  fi


  if [[ -d ${NPM_DIR} ]]; then
    updateVersionReferences ${NPM_DIR}
  fi

  travisFoldEnd "build package: ${PACKAGE}"
done
