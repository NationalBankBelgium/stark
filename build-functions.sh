#!/usr/bin/env bash

#######################################
# Echo the passed message if verbose mode is enabled
# Arguments:
#   param1 - message to log if verbose mode is enabled
#   param2 - depth: spaces to add before the string
#######################################
logDebug() {
  if [[ ${VERBOSE} == true ]] || [[ ${TRACE} == true ]]; then
    logInfo "$@"
  fi
}

#######################################
# Echo the passed message if trace mode is enabled
# Arguments:
#   param1 - message to log if trace mode is enabled
#   param2 - depth: spaces to add before the string
#######################################
logTrace() {
  if [[ ${TRACE} == true ]]; then
    logInfo "$@"
  fi
}

#######################################
# Echo the passed message
# Arguments:
#   param1 - message to log if verbose mode is enabled
#   param2 - (optional) depth: spaces to add before the string (defaults to 0)
#######################################
#log() {
#  local message=${1:-NO MESSAGE TO LOG GIVEN TO log function (this is probably a mistake)}
#  local numSpaces=${2:-0}
#  printf "%${numSpaces}s$message\n"
#}
logInfo() {
  local message="${1:-NO MESSAGE TO LOG GIVEN TO log function (this is probably a mistake)}"
  local numSpaces="${2:-0}"
  printf -v spacing '%*s' "$numSpaces"
  printf "${spacing}%s\n" "$message"
}

#######################################
# Verifies a directory isn't in the ignored list
# Arguments:
#   param1 - Source folder
#   param2 - Destination folder
#   param3 - Options {Array}
#######################################
syncFiles() {
  logTrace "${FUNCNAME[0]}" 1
  logDebug "Syncing files from $1 to $2" 1
  cd $1; # we go to the folder to execute it with relative paths
  local REL_PATH_TO_DESTINATION=$(realpath --relative-to="." "$2");
  shift 2; # those 2 parameters are not needed anymore
	
  logTrace "Syncing files using: rsync" 2
  if [[ ${TRACE} == true ]]; then
    rsync "${@}" ./ $REL_PATH_TO_DESTINATION/ -v
  else
    rsync "${@}" ./ $REL_PATH_TO_DESTINATION/
  fi
  cd - > /dev/null; # go back to the previous folder without any output
}

#######################################
# Verifies a directory isn't in the ignored list
# Arguments:
#   param1 - Path to check
# Returns:
#   Boolean
#######################################
isIgnoredDirectory() {
  logTrace "${FUNCNAME[0]}: Checking for ${1}" 1
  name=$(basename ${1})
  if [[ -f "${1}" || "${name}" == "src" || "${name}" == "test" || "${name}" == "integrationtest" ]]; then
    logTrace "No" 1
    return 0
  else
    logTrace "Yes" 1
    return 1
  fi
}

#######################################
# Recursively runs rollup on any entry point that has a "rollup.config.js" file
# Arguments:
#   param1 - Base source folder containing rollup.config.js
# Returns:
#   None
#######################################
runRollup() {
  logTrace "${FUNCNAME[0]}" 1
  logDebug "Preparing to execute rollup" 1
  local ROLLUP_CONFIG_PATH=${1}/rollup.config.js
  
  if [[ -f $ROLLUP_CONFIG_PATH ]]; then
  	logTrace "${FUNCNAME[0]}: Rollup configuration file found at $ROLLUP_CONFIG_PATH" 2
    cd ${1}
    logTrace "${FUNCNAME[0]}: Rollup command: $ROLLUP -c $ROLLUP_CONFIG_PATH" 2
    local ROLLUP_RESULTS=$($ROLLUP -c rollup.config.js 2>&1) # >/dev/null 2>&1
    cd - > /dev/null
	logTrace "${FUNCNAME[0]}: Rollup execution output: $ROLLUP_RESULTS" 2
	logTrace "${FUNCNAME[0]}: Rollup completed" 2
	
    # Recurse for sub directories
    for DIR in ${1}/* ; do
      isIgnoredDirectory ${DIR} && continue
      logTrace "${FUNCNAME[0]}: Running rollup recursively" 2
      runRollup ${DIR}
      logTrace "${FUNCNAME[0]}: Recursive rollup completed" 2
    done
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
# Rollup index files recursively, ignoring blacklisted directories
# Arguments:
#   param1 - Base source folder
#   param2 - Destination directory
#   param3 - Package name
#   param4 - Is sub directory
# Returns:
#   None
#######################################
rollupIndex() {
  logTrace "${FUNCNAME[0]}" 1
  logDebug "Rolling up index files recursively. Base source folder: $1. Destination directory: $2. Package name: $3. Is sub dir? ${4:-NO}" 1
  # Iterate over the files in this directory, rolling up each into ${2} directory
  in_file="${1}/${3}.js"
  if [ ${4:-} ]; then
    out_file="$(dropLast ${2})/${3}.js"
  else
    out_file="${2}/${3}.js"
  fi
  
  # TODO pass LICENSE_BANNER as a param
  BANNER_TEXT=`cat ${LICENSE_BANNER}`
  if [[ -f ${in_file} ]]; then
    logTrace "Executing rollup with $ROLLUP -i ${in_file} -o ${out_file} --sourcemap -f es --banner \"$BANNER_TEXT\" >/dev/null 2>&1" 2
    $ROLLUP -i ${in_file} -o ${out_file} --sourcemap -f es --banner "$BANNER_TEXT" >/dev/null 2>&1
  fi

  # Recurse for sub directories
  for DIR in ${1}/* ; do
    local sub_package=$(basename "${DIR}")
    isIgnoredDirectory ${DIR} && continue
    local regex=".+/(.+)/${sub_package}.js"
    if [[ "${DIR}/${sub_package}.js" =~ $regex ]]; then
      rollupIndex ${DIR} ${2}/${BASH_REMATCH[1]} ${sub_package} true
    fi
  done
}

#######################################
# Adds banners to all files in a directory
# Arguments:
#   param1 - Directory to add license banners to
# Returns:
#   None
#######################################
addBanners() {
  logTrace "${FUNCNAME[0]}" 1
  logDebug "Adding banners to all files in $1" 1 
  for file in ${1}/*; do
    if [[ -f ${file} && "${file##*.}" != "map" ]]; then
      # TODO pass LICENSE_BANNER as a param
      cat ${LICENSE_BANNER} > ${file}.tmp
      cat ${file} >> ${file}.tmp
      mv ${file}.tmp ${file}
    fi
  done
}

#######################################
# Minifies files in a directory
# Arguments:
#   param1 - Directory to minify
# Returns:
#   None
#######################################
minify() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  logDebug "Minifying JS files in: $1" 1
  
  # Iterate over the files in this directory, rolling up each into ${2} directory
  regex="(.+).js"
  files=(${1}/*)
  logTrace "Identified files to minify: [$files]" 2
  for file in "${files[@]}"; do
    logTrace "Minifying $file" 2
    base_file=$( basename "${file}" )
    if [[ "${base_file}" =~ $regex && "${base_file##*.}" != "map" ]]; then
      local out_file=$(dirname "${file}")/${BASH_REMATCH[1]}.min.js
      logTrace "Running Uglify"
      local UGLIFY_RESULTS=$($UGLIFYJS ${file} -c --comments --output ${out_file} --source-map "base=relative includeSources=true filename=${out_file}.map" 2>&1)
      logTrace "Uglify completed. Execution output: $UGLIFY_RESULTS" 2
    fi
  done
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
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  logDebug "Compiling package [$3] located in: $1" 1
  # For TSC_PACKAGES items
  if containsElement "${3}" "${TSC_PACKAGES[@]}"; then
    logTrace "[$3]: Compiling: $TSC -p $1/tsconfig.json" 2
    $TSC -p ${1}/tsconfig.json
  else
    logTrace "[$3]: Compiling: $NGC -p $1/tsconfig.json" 2
    local package_name=$(basename "${2}")
    $NGC -p ${1}/tsconfig.json
    logTrace "[$3]: Create ${package_name}.d.ts re-export file for tsickle" 2
    
    # this is not a typo!
N="
"

    echo "$(cat ${LICENSE_BANNER}) ${N} export * from \"./src/${package_name}\"" > ${2}/${package_name}.d.ts
    echo "{\"__symbolic\":\"module\",\"version\":3,\"metadata\":{},\"exports\":[{\"from\":\"./${package_name}/${package_name}\"}],\"flatModuleIndexRedirect\":true}" > ${2}/../${package_name}.metadata.json
  fi

  logTrace "Building sub-packages" 2
  for DIR in ${1}/* ; do
    [ -d "${DIR}" ] || continue
    BASE_DIR=$(basename "${DIR}")
    # Skip over directories that are not nested entry points
    [[ -e ${DIR}/tsconfig.json && "${BASE_DIR}" != "integrationtest" ]] || continue
    compilePackage ${DIR} ${2}/${BASE_DIR} ${3}
  done
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
compilePackageES5() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  logDebug "Compiling package located in : $1 to ES5" 1 

  if containsElement "${3}" "${TSC_PACKAGES[@]}"; then
    logTrace "${FUNCNAME[0]}: [${3}]: Compiling: ${TSC} -p ${1}/tsconfig.json --target es5 -d false --outDir ${2} --importHelpers true --sourceMap" 2
    local package_name=$(basename "${2}")
    $TSC -p ${1}/tsconfig.json --target es5 -d false --outDir ${2} --importHelpers true --sourceMap
  else
    logTrace "${FUNCNAME[0]}: [${3}]: Compiling: ${NGC} -p ${1}/tsconfig.json --target es5 -d false --outDir ${2} --importHelpers true --sourceMap" 2
    local package_name=$(basename "${2}")
    $NGC -p ${1}/tsconfig.json --target es5 -d false --outDir ${2} --importHelpers true --sourceMap
  fi

  logTrace "Building sub-packages" 2
  for DIR in ${1}/* ; do
    [ -d "${DIR}" ] || continue
    BASE_DIR=$(basename "${DIR}")
    # Skip over directories that are not nested entry points
    [[ -e ${DIR}/tsconfig.json && "${BASE_DIR}" != "integrationtest" ]] || continue
    compilePackageES5 ${DIR} ${2} ${3}
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
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  logDebug "Adding a package.json where needed for NGC" 1
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

#######################################
# Update version references
# Arguments:
#   param1 - version
#   param2 - directory in which version references should be updated
# Returns:
#   None
#######################################
updateVersionReferences() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  local NPM_DIR="$2"
  (
    cd ${NPM_DIR}
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER\-VERSION/$1/g" $(grep -ril 0\.0\.0\-PLACEHOLDER\-VERSION .) < /dev/null 2> /dev/null
  )
}

#######################################
# Update package name references
# Arguments:
#   param1 - package name
#   param2 - directory in which version references should be updated
# Returns:
#   None
#######################################
updatePackageNameReferences() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  local NPM_DIR="$2"
  (
    cd ${NPM_DIR}
    perl -p -i -e "s/PLACEHOLDER\-PACKAGE\-NAME/${1}/g" $(grep -ril PLACEHOLDER\-PACKAGE\-NAME .) < /dev/null 2> /dev/null
  )
}

#######################################
# Generate NPM ignore file based on the .gitignore at the root
# Arguments:
#   param1 - directory in which the .gitignore file is located
#   param2 - directory in which to place the generated .npmignore file
# Returns:
#   None
#######################################
generateNpmIgnore() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  local PROJECT_ROOT_DIR="$1"
  local NPM_DIR="$2"
  (
    cp $PROJECT_ROOT_DIR/.gitignore $NPM_DIR/.npmignore
  )
}

#######################################
# Generate NPM package (tar.gz) file using npm pack
# Arguments:
#   param1 - directory where npm pack should be executed
# Returns:
#   None
#######################################
generateNpmPackage() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  local NPM_DIR="$1"
  (
    cd $NPM_DIR > /dev/null
    npm pack ./ > /dev/null
  )
}

#######################################
# Update a package.json file's dependencies version for the given stark package
# Arguments:
#   param1 - name of the stark package
#   param2 - version of stark to set
#   param3 - path to the package.json file to adapt
# Returns:
#   None
#######################################
adaptNpmPackageDependencies() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  
  local PACKAGE="$1"
  local VERSION="$2"
  local PACKAGE_JSON_FILE="$3"
  
  local TGZ_PATH="file:..\/dist\/packages-dist\/$PACKAGE\/nationalbankbelgium-$PACKAGE-$VERSION.tgz"
  logTrace "TGZ path: $TGZ_PATH"
  
  local NEWVALUE="\\\"\@nationalbankbelgium\/$PACKAGE\\\": \\\"$TGZ_PATH\\\""
  
  perl -p -i -e "s/\"\@nationalbankbelgium\/$PACKAGE\"\s*\:\s*\".*\"/$NEWVALUE/g" $PACKAGE_JSON_FILE 2> /dev/null
}

#######################################
# Drops the last entry of a path. Similar to normalizing a path such as
# /parent/child/.. to /parent.
# Arguments:
#   param1 - Directory on which to drop the last item
# Returns:
#   None
#######################################
dropLast() {
  local last_item=$(basename ${1})
  local regex=local regex="(.+)/${last_item}"
  if [[ "${1}" =~ $regex ]]; then
    echo "${BASH_REMATCH[1]}"
  else
    echo "${1}"
  fi
}
