#!/bin/bash
# PreToolUse hook - Log all Bash commands
# This helps track what commands are being run

# Parse JSON input from stdin
TOOL=$(jq -r '.tool_name // .tool' 2>/dev/null)

# Only log Bash commands
if [[ "$TOOL" != "Bash" && "$TOOL" != "bash" ]]; then
  exit 0
fi

COMMAND=$(jq -r '.tool_input.command // ""' 2>/dev/null)
DESCRIPTION=$(jq -r '.tool_input.description // "No description"' 2>/dev/null)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Log to file
LOG_FILE="$HOME/.opencode/bash-commands.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$TIMESTAMP] $COMMAND - $DESCRIPTION" >> "$LOG_FILE"

# Exit 0 to allow the command to proceed
exit 0
