---
name: beads-execute
description: This skill should be used when the user asks to "execute tickets", "work on beads", "do the tickets", "execute ready tasks", "work through the backlog", or wants to execute Beads issue tracker tickets with optional parallel subagent execution.
---

Work through Beads tickets systematically, with optional parallel execution via subagents.

**Workflow**: `beads-write` → `beads-execute` → `verify-changes`

## Step 1: Assess Work

```bash
bd ready              # Tickets with no blockers
bd list --status=open # All open tickets
```

## Step 2: Select Tickets

Options:
- **All ready** - Execute everything unblocked
- **Top priority** - Just the highest priority ready ticket
- **Pick from list** - User selects which ones
- **Specific ID** - User provides ticket ID

## Step 3: Execution Strategy

For multiple tickets:
- **Parallel** - Spawn subagents for independent tickets (2-4 at a time)
- **Sequential** - One at a time in priority order
- **Auto** - Decide based on dependencies

## Step 4: Execute Each Ticket

### Read → Plan → Implement → Verify → Close

1. **Read the full ticket** - Understand context and acceptance criteria
2. **Derive a checklist** - Break down into specific steps
3. **Think about edge cases** - What could go wrong?
4. **Implement changes** - Code, tests, docs, configs
5. **Validate** - Run tests/linters, visual check if UI work
6. **Re-read ticket** - Verify every criterion is satisfied
7. **Close ticket** - Only when truly complete

### For UI/Frontend Tickets

Use browser automation to verify visual changes.

### Parallel Execution

For multiple independent tickets, use Task tool to spawn subagents.

## Step 5: Handle Blockers

When blocked:
- Mark ticket blocked and continue with others
- Work through the blocker together
- Create a dependency ticket to capture the blocker
- Abandon if not feasible

## Step 6: Close Tickets

Before closing, verify:
- Tests pass (if applicable)
- No new linter errors
- All acceptance criteria met
- Visual verification passed (for UI work)

```bash
bd close <id> --comment="Brief summary of what was done"
```

## Step 7: Summarize

```bash
bd list --status=open
bd ready
```

Report:
- Tickets completed (with brief summary each)
- Tickets still open
- Any blockers encountered
- Suggested next priorities
