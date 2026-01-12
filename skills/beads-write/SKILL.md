---
name: beads-write
description: This skill should be used when the user asks to "create tickets", "write beads", "plan work", "break down tasks", "capture TODOs", "scope work", or wants to generate Beads issue tracker tickets from codebase analysis.
---

Plan and scope work by creating well-defined Beads tickets from codebase analysis.

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

Understand what work to capture:

**Scope**: What areas to analyze?
- Entire codebase
- Specific directory
- Recent changes
- TODOs/FIXMEs only

**Type**: What kinds of work?
- Bugs & fixes
- New features
- Tech debt / refactoring

**Granularity**: How detailed?
- Epics (large, break down later)
- Tasks (single-session sized)
- Atomic items (very specific changes)

## Step 3: Analyze

```bash
# Find TODOs
rg "TODO|FIXME|HACK|XXX" --type-add 'code:*.{ts,tsx,js,jsx,py,go,rs}' -t code

# Recent changes
git diff --name-only HEAD~10
git status --short
```

## Step 4: Propose Before Creating

Present proposed tickets and confirm approach.

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

## Step 6: Summarize

```bash
bd list
bd ready  # Show what's ready to execute
```

## Good Ticket Qualities

- **Clear scope**: One logical unit of work
- **Acceptance criteria**: How do we know it's done?
- **No ambiguity**: Specific files, functions, behaviors
- **Right size**: Completable in one session
- **Testable**: Can verify with tests or visual check
