#!/usr/bin/env bash

# TODO
#===================
# provide a clean way to define/check the "current" version of node (i.e., the one we should execute the publish under/for)
## ideally we should read it from .nvmrc
# provide support for publishing only a subset of the packages (same --packages logic as in build.sh)
# provide support for publishing locally in addition to GitHub Actions

set -u -e -o pipefail

VERBOSE=false
TRACE=false
DRY_RUN=false

# We read from a file because the list is also shared with build.sh
# Not using readarray because it does not handle \r\n
OLD_IFS=$IFS # save old IFS value
IFS=$'\r\n' GLOBIGNORE='*' command eval 'ALL_PACKAGES=($(cat ./modules.txt))'
IFS=$OLD_IFS # restore IFS

EXPECTED_REPOSITORY="NationalBankBelgium/stark"
GH_ACTIONS_TAG=${GH_ACTIONS_TAG:-""}

#----------------------------------------------
# Uncomment block below to test locally
#----------------------------------------------
#LOGS_DIR=./.tmp/stark/logs
#mkdir -p ${LOGS_DIR}
#LOGS_FILE=${LOGS_DIR}/build-perf.log
#touch ${LOGS_FILE}
#GITHUB_ACTIONS=true
#GITHUB_REPOSITORY="NationalBankBelgium/stark"

# For normal builds:
#GITHUB_EVENT_NAME="pull_request"
#GH_ACTIONS_TAG="fooBar"

# For nightly builds:
#GITHUB_EVENT_NAME="schedule"
#----------------------------------------------

NIGHTLY_BUILD=false

readonly currentDir=$(cd $(dirname $0); pwd)

source ${currentDir}/scripts/ci/_ghactions-group.sh
source ${currentDir}/util-functions.sh

cd ${currentDir}

logInfo "============================================="
logInfo "Stark release publish @ npm"

for ARG in "$@"; do
  case "$ARG" in
    --dry-run)
      logInfo "============================================="
      logInfo "Dry run enabled!"
      DRY_RUN=true
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
    --nightly)
      logInfo "============================================="
      logInfo "Nightly build!"
      NIGHTLY_BUILD=true
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done
logInfo "============================================="

PROJECT_ROOT_DIR=`pwd`
logTrace "PROJECT_ROOT_DIR: ${PROJECT_ROOT_DIR}" 1
ROOT_PACKAGES_DIR=${PROJECT_ROOT_DIR}/dist/packages-dist
logTrace "ROOT_PACKAGES_DIR: ${ROOT_PACKAGES_DIR}" 1

ghActionsGroupStart "publish checks" "no-xtrace"

if [[ ${GITHUB_ACTIONS} == true ]]; then
  logInfo "============================================="
  logInfo "Publishing to npm";
  logInfo "============================================="
  
  # Don't even try if not running against the official repo
  # We don't want release to run outside of our own little world
  if [[ ${GITHUB_REPOSITORY} != ${EXPECTED_REPOSITORY} ]]; then
    logInfo "Skipping release because this is not the main repository.";
    exit 0;
  fi
  
  logInfo "Verifying if this build has been triggered for a tag" 
  
  if [[ ${GITHUB_EVENT_NAME} == "pull_request" ]]; then
    logInfo "Not publishing because this is a build triggered for a pull request" 1
    exit 0;
  elif [[ ${GITHUB_EVENT_NAME} == "schedule" ]]; then
    logInfo "Nightly build initiated by GitHub Actions scheduled job" 1
    NIGHTLY_BUILD=true
  elif [[ ${GH_ACTIONS_TAG} == "" ]]; then
    logInfo "Not publishing because this is not a build triggered for a tag" 1
    exit 0;
  else
    logInfo "This build has been triggered for a tag" 
  fi
fi

ghActionsGroupEnd "publish checks"

logInfo "============================================="
logInfo "Publishing all packages"
logInfo "============================================="
# FIXME Uncomment this once GitHub Actions support nested logs
# See: https://github.community/t5/GitHub-Actions/Feature-Request-Enhancements-to-group-commands-nested-named/m-p/45399
#ghActionsGroupStart "publish" "no-xtrace"
#logInfo "Publishing all packages"

for PACKAGE in ${ALL_PACKAGES[@]}
do
  ghActionsGroupStart "publishing: ${PACKAGE}" "no-xtrace"
    PACKAGE_FOLDER=${ROOT_PACKAGES_DIR}/${PACKAGE}
    logTrace "Package path: ${PACKAGE_FOLDER}" 2
    cd ${PACKAGE_FOLDER}
    TGZ_FILES=`find . -maxdepth 1 -type f | egrep -e ".tgz"`;
    for file in ${TGZ_FILES}; do
      logInfo "Publishing TGZ file: ${TGZ_FILES}" 2
      if [[ ${DRY_RUN} == false ]]; then
        if [[ ${NIGHTLY_BUILD} == false ]]; then
          logTrace "Publishing the release (with tag latest)" 2
          npm publish ${file} --access public
          logTrace "Adapting the tag next to point to the new release" 2
          npm dist-tag add @nationalbankbelgium/${PACKAGE}@${GH_ACTIONS_TAG} next
        else
          logTrace "Check if nightly build is not already published."
          LATEST_NPM_VERSION=`npm view @nationalbankbelgium/${PACKAGE} dist-tags.next`
          FILENAME_LATEST_NPM_PACKAGE="./nationalbankbelgium-${PACKAGE}-${LATEST_NPM_VERSION}.tgz"
        
          if [[ ${file} != ${FILENAME_LATEST_NPM_PACKAGE} ]]; then
            logTrace "Publishing the nightly release (with tag next)" 2
            npm publish ${file} --access public --tag next
          else
            logTrace "Package cannot be published because it is already published." 2
          fi
        fi
      else
        logTrace "DRY RUN, skipping npm publish!" 2
      fi
      logInfo "Package published!" 2
    done
    cd - > /dev/null; # go back to the previous folder without any output  
  ghActionsGroupEnd "publishing: ${PACKAGE}"
done

#ghActionsGroupEnd "publish"

# Print return arrows as a log separator
ghActionsGroupReturnArrows
