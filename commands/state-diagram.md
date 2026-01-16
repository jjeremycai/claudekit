---
description: Analyze a component's state machine, generate Mermaid diagram, update existing docs
argument-hint: <component-path-or-name>
allowed-tools: Read, Glob, Grep, Edit, Write, Task
---

# Create State Diagram

Generate an exhaustive state machine diagram for a component and update existing documentation.

## Arguments

`$ARGUMENTS` = component path or name to analyze

## Execution

### Step 1: Find the Component

If `$ARGUMENTS` is a file path:
- Read the file directly

If `$ARGUMENTS` is a component name:
- Search for files matching the name pattern
- If multiple matches, show options and ask user to clarify

### Step 2: Analyze Exhaustively

Read the entire component and trace ALL state:

**State sources to check:**
- `useState` / `useReducer` hooks
- XState machines or similar
- Class component state
- URL parameters / search params
- Form libraries (react-hook-form, formik, etc.)
- Context consumers that affect behavior
- Refs that gate behavior

**For each state variable, document:**
- All possible values
- Initial value
- What triggers changes
- What side effects occur on change

**CRITICAL: No shortcuts.** Map every single state and transition. The value of this command is exhaustive analysis - if you skip states, you defeat the purpose.

### Step 3: Generate Mermaid Diagram

Create a `stateDiagram-v2` diagram that includes:
- All states with meaningful names
- All transitions with trigger labels
- Guard conditions where applicable `[condition]`
- Notes for complex behavior
- Composite states for nested state machines
- Initial state marker `[*] -->`
- Terminal states if applicable

### Step 4: Update Existing Documentation

Check for and update docs **in this priority order**:

1. **README.md** in component directory or project root
   - Look for existing `## Architecture` or `## State` section
   - If exists: update with new diagram
   - If not: add `## Architecture` section with diagram

2. **ARCHITECTURE.md** if it exists
   - Add or update section for this component
   - Include full diagram + state/transition tables

3. **Inline in component file**
   - Add JSDoc comment with Mermaid diagram
   - Place above the component definition

**Do NOT create new documentation files** unless:
- No README or ARCHITECTURE.md exists anywhere
- Component is complex enough to warrant dedicated docs
- Ask user before creating new files

### Step 5: Output Summary

Show the user:
1. The generated Mermaid diagram (in code block)
2. List of files updated
3. Any edge cases or issues discovered during analysis
4. Suggestions if state machine could be simplified

## Example Usage

```
/create-state-diagram src/components/LoginForm.tsx
```

Output:
```
## LoginForm State Machine

Analyzed LoginForm.tsx and found 4 states with 8 transitions.

### Diagram

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Validating : onSubmit
    Validating --> Idle : validation failed
    Validating --> Submitting : validation passed
    Submitting --> Success : 200
    Submitting --> Error : 4xx/5xx
    Error --> Idle : dismiss
    Success --> [*]
\`\`\`

### Files Updated
- README.md - Added Architecture section
- src/components/LoginForm.tsx - Added inline JSDoc diagram

### Edge Cases Found
- No handling for network timeout
- Race condition possible if user double-clicks submit
```

## Quality Verification

Before completing, verify against this checklist:

- [ ] Every `useState`/`useReducer` accounted for
- [ ] Every conditional branch mapped
- [ ] Error states included
- [ ] Loading/pending states included
- [ ] Initial state clearly marked
- [ ] Transition triggers are specific (not just "changes")
- [ ] Existing docs updated (no unnecessary new files)
