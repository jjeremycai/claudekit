---
name: docs-update
description: This skill should be used when the user asks to "update docs", "sync documentation", "docs are outdated", "refresh README", or wants to update existing documentation to match current code. Spawns @writer agent to compare docs against codebase and update.
---

Update existing documentation to match current codebase using the @writer agent.

## Step 1: Ask Preferences

Before starting, ask the user:

```
AskUserQuestion:
  question: "What should the update focus on?"
  header: "Focus"
  options:
    - label: "Full sync (Recommended)"
      description: "Update all outdated sections, add missing features, remove deprecated"
    - label: "New features only"
      description: "Only document features added since last update"
    - label: "Accuracy check"
      description: "Fix incorrect examples and commands, don't add new content"
```

If existing docs have diagrams, also ask:

```
AskUserQuestion:
  question: "Update architecture diagrams?"
  header: "Diagrams"
  options:
    - label: "Yes, update diagrams"
      description: "Sync diagrams with current architecture"
    - label: "No, skip diagrams"
      description: "Only update text content"
```

## Step 2: Identify Documentation State

```bash
# Find all documentation (or use Glob tool: pattern "**/*.md")
ls *.md 2>/dev/null

# Check if git repo, then check staleness
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "=== Last doc update ==="
  git log -1 --format="%ai %s" -- "*.md"

  echo "=== Last code update ==="
  git log -1 --format="%ai %s" -- "src/" "lib/" "*.ts" "*.js" "*.py" "*.go" "*.rs"

  # Recent code changes since last doc update
  git log --oneline --since="$(git log -1 --format='%ai' -- '*.md')" -- src/ lib/
else
  echo "=== Not a git repo - using file timestamps ==="
  echo "Recent docs:" && ls -lt *.md 2>/dev/null | head -5
  echo "Recent code:" && find src/ lib/ -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) -mtime -7 2>/dev/null | head -5
fi
```

## Step 3: Spawn Writer Agent

Launch @writer with user's preferences:

```
Task: writer
Prompt: |
  Update documentation to match current codebase.

  MODE: UPDATE_MODE
  FOCUS: [from user selection]
  UPDATE_DIAGRAMS: [yes/no from user selection]

  Process:
  1. Read current documentation
  2. Compare against actual code
  3. Identify gaps, inaccuracies, outdated sections
  4. Update in-place, preserving good content

  Existing docs:
  [List from step 2]

  Recent code changes:
  [Summary from step 2]
```

## Step 4: Verification

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
- If docs are severely outdated (>50% needs rewriting), suggest /docs-write instead
