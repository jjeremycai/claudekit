---
description: Execute Beads tickets with subagent parallelization
argument-hint: [ticket-id or "ready"]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Task, AskUserQuestion, mcp__claude-in-chrome__*
---

# Execute Beads Tickets

Work through tickets systematically, with optional parallel execution via subagents.

**Workflow**: `beads-write` → `beads-execute` → `verify-changes`

## When to Use
- After creating tickets with `/beads-write`
- When picking up work from `bd ready`
- To batch-execute multiple tickets in parallel

## Step 1: Assess Work

```bash
bd ready              # Tickets with no blockers
bd list --status=open # All open tickets
```

## Step 2: Select Tickets

If no argument provided, clarify:
- **All ready** - Execute everything unblocked
- **Top priority** - Just the highest priority ready ticket
- **Pick from list** - User selects which ones
- **Specific ID** - User provides ticket ID

## Step 3: Execution Strategy

For multiple tickets:
- **Parallel** - Spawn subagents for independent tickets (2-4 at a time)
- **Sequential** - One at a time in priority order
- **Auto** - Claude decides based on dependencies

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

Use browser automation to verify visual changes:

```bash
# Start dev server if needed
npm run dev
```

Then:
- `mcp__claude-in-chrome__tabs_context_mcp` - Get browser context
- `mcp__claude-in-chrome__tabs_create_mcp` - Create new tab
- `mcp__claude-in-chrome__navigate` - Go to localhost
- `mcp__claude-in-chrome__computer` (screenshot) - Capture result
- `mcp__claude-in-chrome__find` + click - Test interactions

### Parallel Execution

For multiple independent tickets, use Task tool:

```
Task tool → subagent with:
- Ticket ID and full description
- Acceptance criteria
- Instruction to close when complete
```

## Step 5: Handle Blockers

When blocked:
- Mark ticket blocked and continue with others
- Work through the blocker together
- Create a dependency ticket to capture the blocker
- Abandon if not feasible

When tests fail:
- Debug and fix
- Rethink implementation approach
- Revert if necessary

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

**Next step**: When ready to merge, run `/verify-changes` to confirm everything is complete.

## Execution Rules

### Isolation
- No writes to global paths or config
- No global tool installation
- No modifications outside project

### Quality Gates
Before closing any ticket:
- [ ] Tests pass
- [ ] No new linter errors
- [ ] Acceptance criteria satisfied
- [ ] Edge cases handled
- [ ] Visual check passed (if UI)
