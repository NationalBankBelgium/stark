#!/usr/bin/env bash

# Three-Fingered Claw technique :)
# Reference: https://stackoverflow.com/questions/1378274/in-a-bash-script-how-can-i-exit-the-entire-script-if-a-certain-condition-occurs
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "cannot $*"; }

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
