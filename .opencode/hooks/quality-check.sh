#!/bin/bash
# PostToolUse hook - Quality check after Write/Edit operations
# This hook runs ESLint, Prettier, and TypeScript checks after file changes

set -e

# Parse JSON input from stdin
INPUT_JSON=$(cat)
TOOL=$(echo "$INPUT_JSON" | jq -r '.tool_name // .tool' 2>/dev/null)
FILE_PATH=$(echo "$INPUT_JSON" | jq -r '.tool_input.file_path // .tool_input.filePath // ""' 2>/dev/null)

# Only run for Write/Edit tools
if [[ "$TOOL" != "Write" && "$TOOL" != "Edit" && "$TOOL" != "write" && "$TOOL" != "edit" ]]; then
  exit 0
fi

# Only check TypeScript/React files in src/
if [[ ! "$FILE_PATH" =~ src/.*\.tsx?$ ]]; then
  exit 0
fi

# Convert absolute path to relative path
REL_PATH=$(echo "$FILE_PATH" | sed 's|.*/defence-game/||')

echo "🔍 Running quality checks on: $FILE_PATH" >&2

# === CHECK 1: ESLint ===
echo "  [1/3] Running ESLint..." >&2
if npx eslint "$REL_PATH" --max-warnings 0 >/dev/null 2>&1; then
  echo "  ✓ ESLint: PASS" >&2
else
  echo "  ESLint failed, attempting auto-fix..." >&2
  npx eslint "$REL_PATH" --fix --max-warnings 0 >/dev/null 2>&1

  if npx eslint "$REL_PATH" --max-warnings 0 >/dev/null 2>&1; then
    echo "  ✓ ESLint auto-fixed successfully" >&2
  else
    echo "  ✗ ESLint errors remain after auto-fix" >&2
  fi
fi

# === CHECK 2: Prettier ===
echo "  [2/3] Running Prettier..." >&2
if npx prettier --check "$REL_PATH" >/dev/null 2>&1; then
  echo "  ✓ Prettier: PASS" >&2
else
  echo "  Prettier failed, attempting auto-fix..." >&2
  npx prettier --write "$REL_PATH" >/dev/null 2>&1

  if npx prettier --check "$REL_PATH" >/dev/null 2>&1; then
    echo "  ✓ Prettier auto-fixed successfully" >&2
  else
    echo "  ✗ Prettier errors remain" >&2
  fi
fi

# === CHECK 3: TypeScript ===
echo "  [3/3] Running TypeScript type check..." >&2
if npm run type-check >/dev/null 2>&1; then
  echo "  ✓ TypeScript: PASS" >&2
  echo "✅ All quality checks passed!" >&2
else
  echo "  ✗ TypeScript: Type errors detected" >&2
  echo "⚠️  Run 'npm run type-check' to see details" >&2
fi

exit 0
