#!/usr/bin/env bash

# private variable to track groups within this script
ghActionsGroupStack=()

GITHUB_ACTIONS=${GITHUB_ACTIONS:-}
LOGS_FILE=${LOGS_FILE:-""}

function ghActionsGroupStart() {
  local groupName="${0#./}  ${1}"
  # get current time as nanoseconds since the beginning of the epoch
  groupStartTime=$(date +%s%N)
  # convert all non alphanum chars except for "-" and "." to "--"
  local sanitizedGroupName=${groupName//[^[:alnum:]\-\.]/--}
  # strip trailing "-"
  sanitizedGroupName=${sanitizedGroupName%-}
  # push the groupName onto the stack
  ghActionsGroupStack+=("${sanitizedGroupName}|${groupStartTime}")

  echo ""
  if [[ ${GITHUB_ACTIONS} == true ]]; then
    echo "::group::${groupName}"
  fi
  local enterArrow="===>  ${groupName}  ==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>==>"
  # keep all messages consistently wide 80chars regardless of the groupName
  echo ${enterArrow:0:100}
  if [[ ${2:-} != "no-xtrace" ]]; then
    # turn on verbose mode so that we have better visibility into what's going on
    # http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_02_03.html#table_02_01
    set -x
  fi
}

function ghActionsGroupEnd() {
  set +x
  local groupName="${0#./}  ${1}"
  # convert all non alphanum chars except for "-" and "." to "--"
  local sanitizedGroupName=${groupName//[^[:alnum:]\-\.]/--}
  # strip trailing "-"
  sanitizedGroupName=${sanitizedGroupName%-}

  # consult and update ghActionsGroupStack
  local lastGroupIndex=$(expr ${#ghActionsGroupStack[@]} - 1)
  local lastGroupString=${ghActionsGroupStack[$lastGroupIndex]}
  # split the string by | and then turn that into an array
  local lastGroupArray=(${lastGroupString//\|/ })
  local lastSanitizedGroupName=${lastGroupArray[0]}

  if [[ ${GITHUB_ACTIONS} == true ]]; then
    local lastGroupStartTime=${lastGroupArray[1]}
    local groupFinishTime=$(date +%s%N)
    local groupDuration=$(expr ${groupFinishTime} - ${lastGroupStartTime})
    local displayedDuration=$(echo "scale=1; ${groupDuration}/1000000000" | bc | awk '{printf "%.1f\n", $0}')

    # write into build-perf.log file
    local logIndent=$(expr ${lastGroupIndex} \* 2)
    printf "%6ss%${logIndent}s: %s\n" ${displayedDuration} " " "${groupName}" >> ${LOGS_FILE}
  fi

  # pop
  ghActionsGroupStack=(${ghActionsGroupStack[@]:0:lastGroupIndex})

  # check for misalignment
  if [[ ${lastSanitizedGroupName} != ${sanitizedGroupName} ]]; then
    echo "GitHub Actions group mis-alignment detected! ghActionsGroupEnd expected sanitized fold name '${lastSanitizedGroupName}', but received '${sanitizedGroupName}' (after sanitization)"
    exit 1
  fi

  local returnArrow="<===  ${groupName}  <==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<=="
  # keep all messages consistently wide 80chars regardless of the groupName
  echo ${returnArrow:0:100}
  echo ""
  if [[ ${GITHUB_ACTIONS} == true ]]; then
    echo "::endgroup::"
  fi
}

function ghActionsGroupReturnArrows() {
  # print out return arrows so that it's easy to see the end of the script in the log
  echo ""
  returnArrow="<===  ${0#./}  <==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<=="
  # keep all messages consistently wide 80chars regardless of the groupName
  echo ${returnArrow:0:100}
  echo "<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==<==="
  echo ""
}
