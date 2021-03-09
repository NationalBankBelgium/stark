#!/usr/bin/env bash

set -u -e -o pipefail

# Setup environment
readonly thisDir=$(cd $(dirname $0); pwd)
source ${thisDir}/_ghactions-group.sh


for FILE in ${LOGS_DIR}/*; do
  ghActionsGroupStart "print log file: ${FILE}"
    cat $FILE
  ghActionsGroupEnd "print log file: ${FILE}"
done

# Print return arrows as a log separator
ghActionsGroupReturnArrows
