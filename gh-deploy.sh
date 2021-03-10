#!/usr/bin/env bash

# TODO
#===================
# provide a clean way to define/check the "current" version of node (i.e., the one we should execute the publish under/for)
## ideally we should read it from .nvmrc
# for local deployment, instead of using stark-ssh.enc, we should use the GITHUB_API_KEY key passed via --github-api-key=foo
## if present then we could push directly without handling decryption, etc

set -u -e -o pipefail

VERBOSE=false
TRACE=false
DRY_RUN=false
ENFORCE_SHOWCASE_VERSION_CHECK=true
TARGET_BRANCH="gh-pages"
COMMIT_HASH=`git rev-parse --verify HEAD`

TARGET_REPO="github.com/NationalBankBelgium/stark.git"
EXPECTED_REPOSITORY="NationalBankBelgium/stark"
GH_ACTIONS_TAG=${GH_ACTIONS_TAG:-""}
GITHUB_EVENT_NAME=${GITHUB_EVENT_NAME:-""}

COMMIT_AUTHOR_USERNAME="Github-Actions-CI"
COMMIT_AUTHOR_EMAIL="alexis.georges@nbb.be"

STARK_CORE="stark-core"
STARK_UI="stark-ui"
STARK_RBAC="stark-rbac"
SHOWCASE="showcase"
API_DOCS_DIR_NAME="api-docs"
LATEST_DIR_NAME="latest"

#----------------------------------------------
# Uncomment and adapt block below to test locally
#----------------------------------------------
#LOGS_DIR=./.tmp/stark/logs
#mkdir -p ${LOGS_DIR}
#LOGS_FILE=${LOGS_DIR}/build-perf.log
#touch ${LOGS_FILE}
#DRY_RUN=true
#GITHUB_ACTIONS=true
#GITHUB_ACTOR="SuperITMan"
#GITHUB_SHA=${COMMIT_HASH}
#GITHUB_REPOSITORY="NationalBankBelgium/stark" # yes we're always on the correct repo
#ENFORCE_SHOWCASE_VERSION_CHECK=false # allows not have consistency between tag version and showcase version

# Point to a fork or any other repo
#TARGET_REPO="github.com/superitman/stark.git"

# Avoid messing up Git config (even though limited to the current repo)
#COMMIT_AUTHOR_USERNAME="Alexis Georges"
#COMMIT_AUTHOR_EMAIL="alexis.georges@nbb.be"

# For PRs (NOT accepted)
#GITHUB_EVENT_NAME="pull_request"

# For nightly builds (NOT accepted)
#GITHUB_EVENT_TYPE="schedule"

# For releases
#GH_ACTIONS_TAG="barFoo"
#GITHUB_EVENT_NAME="push"

#----------------------------------------------

readonly currentDir=$(cd $(dirname $0); pwd)

source ${currentDir}/scripts/ci/_ghactions-group.sh
source ${currentDir}/util-functions.sh

cd ${currentDir}

logInfo "============================================="
logInfo "Stark docs publish @ github pages"

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
    --github-api-key=*)
      logInfo "============================================="
      logInfo "Github API key provided"
      GITHUB_API_KEY=${ARG#--github-api-key=}
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

API_DOCS_SOURCE_DIR=${PROJECT_ROOT_DIR}/reports/${API_DOCS_DIR_NAME}
logTrace "API_DOCS_SOURCE_DIR: ${API_DOCS_SOURCE_DIR}"

SHOWCASE_SOURCE_DIR=${PROJECT_ROOT_DIR}/${SHOWCASE}/dist
logTrace "SHOWCASE_SOURCE_DIR: ${SHOWCASE_SOURCE_DIR}"

DOCS_WORK_DIR=${PROJECT_ROOT_DIR}/.tmp/ghpages
logTrace "DOCS_WORK_DIR: ${DOCS_WORK_DIR}" 1

logTrace "Cleaning the docs work directory..." 2
rm -rf ${DOCS_WORK_DIR}
mkdir -p ${DOCS_WORK_DIR}


ghActionsGroupStart "docs publication checks" "no-xtrace"

if [[ ${GITHUB_ACTIONS} == true ]]; then
  logInfo "Publishing docs to GH pages";
  logInfo "============================================="

  # Don't even try if not running against the official repo
  # We don't want docs publish to run outside of our own little world
  if [[ ${GITHUB_REPOSITORY} != ${EXPECTED_REPOSITORY} ]]; then
    logInfo "Skipping release because this is not the main repository.";
    exit 0;
  fi

  if [[ ${GITHUB_EVENT_NAME} == "pull_request" ]]; then
    logInfo "Not publishing because this is a build triggered for a pull request" 1
    exit 0;
  fi

  if [[ ${GITHUB_EVENT_NAME} == "schedule" ]]; then
    logInfo "Not publishing because this is a build triggered for a nightly build" 1
    exit 0;
  fi

  if [[ ${GH_ACTIONS_TAG} == "" ]]; then
    logInfo "Not publishing because this is not a build triggered for a tag" 1
    exit 0;
  else
    logInfo "OK, this build has been triggered for a tag"
  fi
else
  logInfo "Not publishing because we are not in GitHub Actions. Currently that is the only supported option!"
  exit 0
fi

ghActionsGroupEnd "docs publication checks"


ghActionsGroupStart "docs generation" "no-xtrace"

logInfo "Generating API docs"
npm run docs:stark-core:generate
npm run docs:stark-ui:generate
npm run docs:stark-rbac:generate
logTrace "API docs generated successfully" 1

ghActionsGroupEnd "docs generation" "no-xtrace"



ghActionsGroupStart "docs publication" "no-xtrace"

logInfo "Publishing API docs"

logTrace "Determining target folders for api docs" 1

DOCS_VERSION=${GH_ACTIONS_TAG}
SHOWCASE_PACKAGE_VERSION=$(node -p "require('./package.json').version")
#alternative (faster but less safe): SHOWCASE_PACKAGE_VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json) 

if [[ ${ENFORCE_SHOWCASE_VERSION_CHECK} == true ]]; then
    logTrace "Checking for version consistency between the tag and the showcase" 1
    if [[ ${DOCS_VERSION} != ${SHOWCASE_PACKAGE_VERSION} ]]; then
      logInfo "Cannot publish the documentation because the showcase version does not match the tagged version (tag name). Please update the showcase!"
      exit -1;
    fi
fi

logTrace "Version for which we are producing docs: ${DOCS_VERSION}"

if [[ ${GITHUB_ACTIONS} == true ]]; then
    logTrace "Configuring Git for GitHub Actions"
    git config user.name ${COMMIT_AUTHOR_USERNAME}
    git config user.email ${COMMIT_AUTHOR_EMAIL}
fi

logTrace "Cloning stark's github pages branch to ${DOCS_WORK_DIR}"

AUTHENTICATED_TARGET_REPO=https://${GITHUB_ACTOR}:${GITHUB_API_KEY}@${TARGET_REPO}

git clone --quiet --depth=1 --branch=${TARGET_BRANCH} ${AUTHENTICATED_TARGET_REPO} ${DOCS_WORK_DIR}

API_DOCS_TARGET_DIR_STARK_CORE=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_CORE}/${DOCS_VERSION}
API_DOCS_TARGET_DIR_STARK_CORE_LATEST=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_CORE}/${LATEST_DIR_NAME}

API_DOCS_TARGET_DIR_STARK_UI=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_UI}/${DOCS_VERSION}
API_DOCS_TARGET_DIR_STARK_UI_LATEST=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_UI}/${LATEST_DIR_NAME}

API_DOCS_TARGET_DIR_STARK_RBAC=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_RBAC}/${DOCS_VERSION}
API_DOCS_TARGET_DIR_STARK_RBAC_LATEST=${DOCS_WORK_DIR}/${API_DOCS_DIR_NAME}/${STARK_RBAC}/${LATEST_DIR_NAME}

SHOWCASE_TARGET_DIR=${DOCS_WORK_DIR}/${SHOWCASE}/${DOCS_VERSION}
SHOWCASE_TARGET_DIR_LATEST=${DOCS_WORK_DIR}/${SHOWCASE}/${LATEST_DIR_NAME}

logTrace "Cleaning all '${LATEST_DIR_NAME}' directories from API docs and showcase..." 2
rm -rf ${API_DOCS_TARGET_DIR_STARK_CORE_LATEST}
mkdir -p ${API_DOCS_TARGET_DIR_STARK_CORE_LATEST}

rm -rf ${API_DOCS_TARGET_DIR_STARK_UI_LATEST}
mkdir -p ${API_DOCS_TARGET_DIR_STARK_UI_LATEST}

rm -rf ${SHOWCASE_TARGET_DIR_LATEST}
mkdir -p ${SHOWCASE_TARGET_DIR_LATEST}

logTrace "Copying the API docs"

syncOptions=(--archive --delete --ignore-errors --quiet --include="**/**") # we overwrite docs if they're present already for this version

logTrace "Copying ${STARK_CORE} API docs"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_CORE} ${API_DOCS_TARGET_DIR_STARK_CORE} "${syncOptions[@]}"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_CORE} ${API_DOCS_TARGET_DIR_STARK_CORE_LATEST} "${syncOptions[@]}"

logTrace "Copying ${STARK_UI} API docs"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_UI} ${API_DOCS_TARGET_DIR_STARK_UI} "${syncOptions[@]}"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_UI} ${API_DOCS_TARGET_DIR_STARK_UI_LATEST} "${syncOptions[@]}"

logTrace "Copying ${STARK_RBAC} API docs"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_RBAC} ${API_DOCS_TARGET_DIR_STARK_RBAC} "${syncOptions[@]}"
syncFiles ${API_DOCS_SOURCE_DIR}/${STARK_RBAC} ${API_DOCS_TARGET_DIR_STARK_RBAC_LATEST} "${syncOptions[@]}"

logTrace "Copying ${SHOWCASE}"

NODE_REPLACE_URLS="node ${PROJECT_ROOT_DIR}/${SHOWCASE}/ghpages-adapt-bundle-urls.js"

$NODE_REPLACE_URLS "${LATEST_DIR_NAME}"
syncFiles ${SHOWCASE_SOURCE_DIR} ${SHOWCASE_TARGET_DIR_LATEST} "${syncOptions[@]}"
$NODE_REPLACE_URLS "${DOCS_VERSION}" "${LATEST_DIR_NAME}"
syncFiles ${SHOWCASE_SOURCE_DIR} ${SHOWCASE_TARGET_DIR} "${syncOptions[@]}"

unset syncOptions

logInfo "Pushing the docs to GitHub pages"

cd ${DOCS_WORK_DIR}
git add -A &> /dev/null # way too long
git commit --quiet -m "Publishing docs for version: ${DOCS_VERSION}"
git push --quiet --force
cd - > /dev/null

logInfo "Documentation published successfully!"

ghActionsGroupEnd "docs publication"

# Print return arrows as a log separator
ghActionsGroupReturnArrows
