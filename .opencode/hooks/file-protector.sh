#!/bin/bash
# PreToolUse hook - Protect sensitive files from being edited
# Returns exit code 2 to block the operation

# Debug: Capture input
INPUT_JSON=$(cat)
echo "[file-protector] DEBUG: Received input" >&2

# Try to parse JSON
if echo "$INPUT_JSON" | jq empty 2>/dev/null; then
    echo "[file-protector] DEBUG: Valid JSON" >&2
    TOOL=$(echo "$INPUT_JSON" | jq -r '.tool_name // .tool' 2>/dev/null)
    echo "[file-protector] DEBUG: TOOL=$TOOL" >&2
else
    echo "[file-protector] WARNING: Invalid JSON input" >&2
    exit 0
fi

# Only check Write/Edit operations
if [[ "$TOOL" != "Write" && "$TOOL" != "Edit" && "$TOOL" != "write" && "$TOOL" != "edit" ]]; then
    exit 0
fi

FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // .tool_input.filePath // ""' 2>/dev/null)
echo "[file-protector] DEBUG: FILE_PATH=$FILE_PATH" >&2

# List of protected patterns
PROTECTED_PATTERNS=(
  ".env"
  "package-lock.json"
  ".git/"
  "node_modules/"
  "dist/"
  "build/"
)

# Check if file matches any protected pattern
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "❌ Cannot modify protected file: $FILE_PATH" >&2
    echo "   Pattern matched: $pattern" >&2
    # Exit code 2 blocks the operation
    exit 2
  fi
done

# Allow the operation
exit 0
