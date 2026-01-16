---
name: docs-update
description: This skill should be used when the user asks to "update docs", "sync documentation", "docs are outdated", "refresh README", or wants to update existing documentation to match current code. Spawns @writer agent to compare docs against codebase and update.
---

Update existing documentation to match current codebase using the @writer agent.

## Execution

### 1. Identify Documentation State

```bash
# Find all documentation
fd -e md

# Check staleness (docs vs code last modified)
echo "=== Last doc update ==="
git log -1 --format="%ai %s" -- "*.md"

echo "=== Last code update ==="
git log -1 --format="%ai %s" -- "src/" "lib/" "*.ts" "*.js" "*.py" "*.go" "*.rs"

# Recent code changes since last doc update
git log --oneline --since="$(git log -1 --format='%ai' -- '*.md')" -- src/ lib/
```

### 2. Spawn @writer Agent

Launch a single @writer agent with UPDATE_MODE:

```
Task: writer
Prompt: |
  Update documentation to match current codebase.

  MODE: UPDATE_MODE

  Process:
  1. Read current documentation
  2. Compare against actual code
  3. Identify gaps, inaccuracies, outdated sections
  4. Update in-place, preserving good content

  Focus on:
  - New features not documented
  - Changed APIs or configuration
  - Deprecated features still documented
  - Incorrect examples or commands

  Existing docs:
  [List from step 1]

  Recent code changes:
  [Summary from step 1]
```

### 3. Verification

After @writer completes:

```bash
# Show changes
git diff --stat -- "*.md"
git diff -- README.md | head -100
```

## Output Format

### Documentation Updates

| File | Changes |
|------|---------|
| README.md | Added X, Updated Y, Removed Z |

### What Changed

**Added:**
- New section for feature X
- Configuration options for Y

**Updated:**
- API endpoint examples
- Installation instructions

**Removed:**
- References to deprecated feature Z

### Verification

- [ ] Commands tested and working
- [ ] Examples verified against code
- [ ] No placeholder text remaining

## Notes

- Preserve existing structure where possible
- Don't rewrite good documentation
- Focus on accuracy over style
- If docs are severely outdated, suggest /docs-write instead
