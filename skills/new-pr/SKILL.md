---
name: new-pr
description: This skill should be used when the user asks to "create a PR", "open a pull request", "submit for review", "push my changes", or wants to create a new pull request from current changes. Handles branch detection, commit, push, and PR creation.
---

Create a new pull request from current changes with smart branch/target detection.

## Pre-flight Checks

```bash
# Check current branch and status
git branch --show-current
git status --porcelain

# Check remote tracking and sync state
git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null || echo "No upstream set"
git status -sb

# Check for uncommitted changes
git diff --stat
git diff --cached --stat
```

## Decision Tree

### If on main/master branch:
STOP. Ask user: "You're on the main branch. Should I create a feature branch first?"

### If no changes exist:
STOP. Tell user: "No changes detected. Working tree is clean and up to date with remote."

### If uncommitted changes:
1. Review the diff: `git diff` and `git diff --cached`
2. Check commit message conventions: `git log --oneline -10`
3. Commit with meaningful message

### If branch exists on remote but is behind:
Check if force push is needed. Ask user before force pushing.

## Target Branch Detection

Priority order:
1. Explicit argument from user
2. Default branch: `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`
3. Common patterns: main, master, develop
4. ASK if unclear

## PR Creation Steps

1. **Review all changes:**
   ```bash
   git log origin/<target>..HEAD --oneline
   git diff origin/<target>...HEAD --stat
   ```

2. **Check for conflicts:**
   ```bash
   git fetch origin <target>
   git merge-base HEAD origin/<target>
   ```

3. **Check for PR template:**
   ```bash
   cat .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null
   ```

4. **Create the PR:**
   - Title: Under 80 chars, imperative mood
   - Body: Describes the "why", includes test plan
   - Use `--draft` if WIP

## After Creation

1. Output the PR URL prominently
2. Mention CI will run if configured
3. Ask if user wants to request reviewers
