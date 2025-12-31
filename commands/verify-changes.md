---
description: Verify that PR feedback has been properly addressed before merge
argument-hint: [pr-url-or-number]
allowed-tools: Bash, Read, Grep, Glob, mcp__claude-in-chrome__*
---

# Verify PR Changes

Confirm that review feedback has been addressed and work is ready to merge.

**Workflow**: `beads-write` → `beads-execute` → `verify-changes`

## When to Use
- After addressing PR review comments
- Before merging to confirm all feedback resolved
- Final check that implementation matches requirements

## Verification Checklist

Use extended thinking to verify:

1. Were original issues fixed correctly (not superficially)?
2. Did fixes introduce new problems?
3. Is CI passing?
4. For UI changes: Does it look/work correctly? (browser automation)
5. If using Beads: Are related tickets closed?

## Step 1: Get Review Context

```bash
# Get PR info (uses current branch if no argument)
gh pr view $ARGUMENTS --json reviews,comments --jq '.reviews[] | {author: .author.login, state: .state, body: .body}'

# Get inline comments
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --jq '.[] | {path: .path, line: .line, body: .body}'

# Check conversation threads
gh pr view $ARGUMENTS --comments
```

If no PR number: check `gh pr view --json number` or ask user.

## Step 2: Catalog Issues

List all issues raised:
- **Blocking** - Changes requested
- **Suggestions** - Non-blocking improvements
- **Questions** - Needed clarification

## Step 3: Examine Changes

```bash
# What changed since review
git log --oneline origin/<base>..HEAD

# Current diff
gh pr diff $ARGUMENTS

# CI status
gh pr checks $ARGUMENTS
```

## Step 4: Verify Each Issue

For each issue raised:
- [ ] **Fixed** - Correctly handles this
- [ ] **Partially fixed** - Attempted but incomplete
- [ ] **Not fixed** - Issue still present
- [ ] **Won't fix** - Valid justification provided
- [ ] **Regression** - Fix broke something else

## Step 5: Visual Testing (If UI Changes)

For frontend/UI changes, verify visually:

```bash
# Start dev server if needed
npm run dev
```

Use browser automation:
- `mcp__claude-in-chrome__tabs_context_mcp` - Get context
- `mcp__claude-in-chrome__tabs_create_mcp` - New tab
- `mcp__claude-in-chrome__navigate` - Go to localhost
- `mcp__claude-in-chrome__computer` (screenshot) - Capture state
- `mcp__claude-in-chrome__find` + click - Test interactions

**Skip when**: Backend-only, docs/config changes, no dev server.

## Step 6: Beads Tickets (If Used)

```bash
# Check if project uses Beads
bd list 2>/dev/null
```

If Beads is initialized:
- Search for related tickets: `bd search "<PR keywords>"`
- Verify tickets are closed with appropriate comments
- Check for work not tracked by any ticket

```bash
# Close completed tickets if needed
bd close <id> --comment="Completed in PR #<number>"
```

**Skip when**: `bd list` fails or no `.beads` directory.

## Step 7: Report

### Addressed Issues
List resolved issues with confirmation.

### Outstanding Issues
For unresolved:
1. Quote original concern
2. What was expected
3. Current state
4. Guidance to fix

### New Concerns
Problems introduced by fixes.

### Visual Testing (if applicable)
- UI behaves as expected / issues found
- Interactions work correctly / broken

### Beads Status (if applicable)
- Related tickets: (IDs)
- Properly closed: Yes / No
- Missing references: (any)

### Recommendation

- **Ready to merge** - All blocking issues resolved, CI passing, visual OK, tickets closed
- **Minor changes needed** - Non-blocking remain, could merge with follow-up
- **Changes required** - Blocking issues, regressions, or tickets not updated
- **Needs discussion** - Fundamental disagreement on approach
