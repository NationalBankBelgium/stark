#!/usr/bin/env bash

#######################################
# Verifies a directory isn't in the ignored list
# Arguments:
#   param1 - Path to check
# Returns:
#   Boolean
#######################################
isIgnoredDirectory() {
  #logTrace "${FUNCNAME[0]}: Checking for ${1}" 1
  name=$(basename ${1})
  if [[ -f "${1}" || "${name}" == "src" || "${name}" == "test" || "${name}" == "integrationtest" || "${name}" == "reports" || "${name}" == "coverage" || "${name}" == "assets" || "${name}" == "typings" || "${name}" == "node_modules" ]]; then
    #logTrace "No" 1
    return 0
  else
    #logTrace "Yes" 1
    return 1
  fi
}

#######################################
# Run "ng build <library_name>"
# Arguments:
#   param1 - Library name

# Returns:
#   None
#######################################
ngBuild() {
  logTrace "Executing function: ${FUNCNAME[0]}: 'ng build ${1}'" 1
  logTrace "${FUNCNAME[0]}: command: '${NG} build ${1}'" 2
  ${NG} build $1
  logTrace "${FUNCNAME[0]}: 'ng build ${1}' completed" 1
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
      logTrace "Adding banner to : ${file}"
      cat ${LICENSE_BANNER} > ${file}.tmp
      cat ${file} >> ${file}.tmp
      mv ${file}.tmp ${file}
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
    
    local PATTERN="0\.0\.0\-PLACEHOLDER\-VERSION"
    perl -p -i.bak -e "s/$PATTERN/$1/g" ./package.json
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
    
    local PATTERN="PLACEHOLDER\-PACKAGE\-NAME"
    perl -p -i.bak -e "s/$PATTERN/$1/g" ./package.json
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
    npm pack ./ --silent
  )
}

#######################################
# Update a package.json file's dependencies version for the given stark package
# Arguments:
#   param1 - name of the stark package
#   param2 - version of stark to set
#   param3 - path to the package.json file to adapt
#   param4 - sub level of the package to adapt
# Returns:
#   None
#######################################
adaptNpmPackageDependencies() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  
  local PACKAGE="$1"
  local VERSION="$2"
  local PACKAGE_JSON_FILE="$3"
  local SUB_LEVEL=$(($4))
  
  local PATH_PARENT=""
  
  index=1
  while [[ $index -le $SUB_LEVEL ]]
  do 
    PATH_PARENT="..\/$PATH_PARENT"
    index=$index+1
  done
  
  local TGZ_PATH="file:${PATH_PARENT}dist\/packages-dist\/$PACKAGE\/nationalbankbelgium-$PACKAGE-$VERSION.tgz"
  logTrace "TGZ path: $TGZ_PATH"
  
  local PATTERN="\"\@nationalbankbelgium\/$PACKAGE\"\s*\:\s*\".*\""
  local REPLACEMENT="\\\"\@nationalbankbelgium\/$PACKAGE\\\": \\\"$TGZ_PATH\\\""
  
  logTrace "PATTERN: $PATTERN"
  logTrace "REPLACEMENT: $REPLACEMENT"
  logTrace "Package JSON file: $PACKAGE_JSON_FILE"

  # Packages will have dependencies between them. They will so have "devDependencies" and "peerDependencies" with different values.
  # We should only replace the value of the devDependency for make it work.

  perl -p -i.bak -e "s/$PATTERN/$REPLACEMENT/" $PACKAGE_JSON_FILE
}

#######################################
# Update a package-lock.json file's dependencies version for the given stark package
# Arguments:
#   param1 - name of the stark package
#   param2 - version of stark to set
#   param3 - path to the package-lock.json file to adapt
#   param4 - sub level of the package to adapt
# Returns:
#   None
#######################################
adaptNpmPackageLockDependencies() {
  logTrace "Executing function: ${FUNCNAME[0]}" 1
  
  local PACKAGE="$1"
  local VERSION="$2"
  local PACKAGE_JSON_FILE="$3"
  local SUB_LEVEL=$(($4))
  
  local PATH_PARENT=""
  
  index=1
  while [[ $index -le $SUB_LEVEL ]]
  do 
    PATH_PARENT="..\/$PATH_PARENT"
    index=$index+1
  done
  
  local TGZ_REALPATH="dist/packages-dist/$PACKAGE/nationalbankbelgium-$PACKAGE-$VERSION.tgz"
  local TGZ_PATH="file:${PATH_PARENT}dist\/packages-dist\/$PACKAGE\/nationalbankbelgium-$PACKAGE-$VERSION.tgz"
  logTrace "TGZ path: $TGZ_PATH"
  
  SHA="$(openssl dgst -sha512 -binary ./$TGZ_REALPATH  | openssl enc -A -base64)"
  ESCAPED_SHA=${SHA//\//\\/}
  
  logTrace "SHA-512: $SHA"
  logTrace "SHA-512 escaped: $ESCAPED_SHA"
  
  local PATTERN="\\\"\@nationalbankbelgium\/$PACKAGE\\\": \\{(\s*)\\\"version\\\": \\\"(\S*)\\\"(,(\s*)\\\"resolved\\\": \\\"(.*))?,(\s*)\\\"integrity\\\": \\\"sha512-(.*)\\\""
  local REPLACEMENT='"\@nationalbankbelgium\/'$PACKAGE'": {$1"version": "'$TGZ_PATH'",$4"integrity": "sha512-'$ESCAPED_SHA'"'
  
  logTrace "PATTERN: $PATTERN"
  logTrace "REPLACEMENT: $REPLACEMENT"
  logTrace "Package JSON file: $PACKAGE_JSON_FILE"
  
  # Packages will have dependencies between them. They will so have "devDependencies" and "peerDependencies" with different values.
  # We should only replace the value of the devDependency for make it work.
  
  perl -p -i.bak -0 -e "s/$PATTERN/$REPLACEMENT/m" $PACKAGE_JSON_FILE
  
  # In npm >= v8, the package-lock.json file contains also the path in the node_modules folder.
  local PATTERN="\\\"node_modules\/\@nationalbankbelgium\/$PACKAGE\\\": \\{(\s*)\\\"version\\\": \\\"(\S*)\\\"(,(\s*)\\\"resolved\\\": \\\"(.*))?,(\s*)\\\"integrity\\\": \\\"sha512-(.*)\\\""
	local REPLACEMENT='"node_modules\/\@nationalbankbelgium\/'$PACKAGE'": {$1"version":"$2","resolved":"'$TGZ_PATH'",$4"integrity": "sha512-'$ESCAPED_SHA'"'

	logTrace "PATTERN: $PATTERN"
	logTrace "REPLACEMENT: $REPLACEMENT"
	logTrace "Package JSON file: $PACKAGE_JSON_FILE"

	# Packages will have dependencies between them. They will so have "devDependencies" and "peerDependencies" with different values.
	# We should only replace the value of the devDependency for make it work.

	perl -p -i.bak -0 -e "s/$PATTERN/$REPLACEMENT/m" $PACKAGE_JSON_FILE
}
