#!/usr/bin/env sh
#
# check-stories.sh — Lists components missing Storybook stories.
# Run in CI as a warning (exit 0), not a blocker.
#
# Scans src/components/ for .tsx files that are NOT:
#   - stories files themselves
#   - ui/ primitives (shadcn)
#   - ai-elements/ (third-party)
#   - index.ts barrel files
#
# Then checks if a matching .stories.tsx exists.

echo ""
echo "========================================"
echo "  STORY COVERAGE CHECK"
echo "========================================"
echo ""

MISSING=0
TOTAL=0
MISSING_LIST=""

for file in $(find src/components -name "*.tsx" \
  ! -name "*.stories.tsx" \
  ! -name "*.test.tsx" \
  ! -name "index.tsx" \
  ! -path "*/ui/*" \
  ! -path "*/ai-elements/*" \
  | sort); do

  TOTAL=$((TOTAL + 1))
  STORY_FILE="${file%.tsx}.stories.tsx"

  if [ ! -f "$STORY_FILE" ]; then
    MISSING=$((MISSING + 1))
    MISSING_LIST="$MISSING_LIST\n    $file"
  fi
done

COVERED=$((TOTAL - MISSING))

if [ "$MISSING" -eq 0 ]; then
  echo "  All $TOTAL components have stories."
  echo ""
else
  echo "  Coverage: $COVERED/$TOTAL components have stories"
  echo ""
  echo "  Missing stories:"
  echo "$MISSING_LIST" | sed '/^$/d'
  echo ""
  echo "  To add a story, create a .stories.tsx file next to"
  echo "  the component with the same base name."
  echo ""
  echo "  Example: src/components/chat/event-card.tsx"
  echo "        -> src/components/chat/event-card.stories.tsx"
  echo ""
fi

echo "========================================"
echo ""

# Always exit 0 — this is a warning, not a blocker
exit 0
