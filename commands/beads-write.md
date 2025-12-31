---
description: Generate Beads tickets for this project based on codebase analysis
allowed-tools: Bash, Read, Glob, Grep, AskUserQuestion
---

# Generate Beads Tickets

Plan and scope work by creating well-defined tickets from codebase analysis.

**Workflow**: `beads-write` → `beads-execute` → `verify-changes`

## When to Use
- Starting a new feature or project phase
- Auditing codebase for tech debt, bugs, or improvements
- Converting TODOs/FIXMEs into trackable work
- Breaking down a large task into smaller tickets

## Step 1: Initialize

```bash
# Check if beads is initialized
bd list 2>/dev/null || bd init

# Understand project structure
ls -la
cat package.json 2>/dev/null || cat Cargo.toml 2>/dev/null || cat go.mod 2>/dev/null
```

## Step 2: Clarify Scope

Use AskUserQuestion to understand what work to capture:

**Scope**: What areas to analyze?
- Entire codebase
- Specific directory
- Recent changes (uncommitted or last N commits)
- TODOs/FIXMEs only

**Type**: What kinds of work?
- Bugs & fixes
- New features
- Tech debt / refactoring
- All of the above

**Granularity**: How detailed?
- Epics (large, break down later)
- Tasks (single-session sized)
- Atomic items (very specific changes)

## Step 3: Analyze

Based on scope, gather information:

```bash
# Find TODOs
rg "TODO|FIXME|HACK|XXX" --type-add 'code:*.{ts,tsx,js,jsx,py,go,rs}' -t code

# Recent changes
git diff --name-only HEAD~10
git status --short

# Test coverage gaps
ls -la src/ tests/ 2>/dev/null
```

## Step 4: Propose Before Creating

Present proposed tickets and confirm:
- Create all
- Review each one first
- Only top priority items
- User selects specific ones

## Step 5: Create Tickets

```bash
bd create --title="Clear imperative title" --description="
## Context
Why this matters.

## Acceptance Criteria
- [ ] Specific checkable item
- [ ] Another checkable item

## Notes
Relevant context or constraints.
"
```

For worktrees: `bd --no-daemon create ...`

## Step 6: Summarize

```bash
bd list
bd ready  # Show what's ready to execute
```

**Next step**: Run `/beads-execute` to work through tickets.

## Good Ticket Qualities

- **Clear scope**: One logical unit of work
- **Acceptance criteria**: How do we know it's done?
- **No ambiguity**: Specific files, functions, behaviors
- **Right size**: Completable in one session
- **Testable**: Can verify with tests or visual check
