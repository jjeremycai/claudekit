---
description: Execute fixes for issues identified by /review using @engineer subagents
argument-hint: [--critical-only] [--all]
agent: plan
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, Task, WebFetch, mcp__plugin_context7_context7__resolve-library-id, mcp__plugin_context7_context7__get-library-docs
---

Execute fixes for code issues identified by a prior `/review`. This command assumes `/review` has already been run and its output is available in the conversation.

Flags: $ARGUMENTS

## Flags

- `--critical-only`: Only fix critical issues
- `--all`: Fix all issues including suggestions (default: critical + warnings only)

## Prerequisites

This command expects `/review` output in the conversation containing:
- Issues with file paths and line numbers
- Severity levels (critical/warning/suggestion)
- Issue descriptions with realistic scenarios
- Suggested fixes (if provided)

If no review output is found, prompt the user to run `/review` first.

## Execution

### 1. Parse Review Output

Extract fixable issues from the prior `/review` output:

```
Issues to fix:
- [critical] path/file.ts:123 - Issue description
- [warning] path/file.ts:456 - Issue description
...
```

Filter based on flags:
- Default: Critical + Warning
- `--critical-only`: Critical only
- `--all`: Critical + Warning + Suggestions

### 2. Group by File

Group issues by file to minimize context switching:

```
path/file1.ts:
  - Line 123: [critical] Issue A
  - Line 456: [warning] Issue B

path/file2.ts:
  - Line 78: [warning] Issue C
```

### 3. Spawn @engineer Agents

For each file with issues, spawn an @engineer subagent with:

```
Fix the following issues in [filepath]:

1. Line [N]: [severity] [issue description]
   Suggested fix: [if available]

2. Line [M]: [severity] [issue description]
   Suggested fix: [if available]

Rules:
- Make minimal changes - only fix the reported issues
- Don't refactor or improve adjacent code
- Don't add extra error handling "while you're there"
- Preserve all existing behavior except the bug
- Read the full file first to understand context
```

Spawn agents in parallel for independent files.

### 4. Collect Results

Each @engineer returns:
- What was changed (before/after)
- Verification that the issue is resolved
- Any issues that couldn't be fixed and why

### 5. Verification

After all agents complete:

```bash
# Syntax check (TypeScript projects)
npx tsc --noEmit 2>&1 | head -50

# Run tests if available
npm test 2>&1 | head -100

# Show changes
git diff --stat
```

## Output Format

### Fixes Applied

| File | Line | Severity | Issue | Status |
|------|------|----------|-------|--------|
| path/file.ts | 123 | critical | ... | Fixed |
| path/file.ts | 456 | warning | ... | Fixed |
| path/other.ts | 78 | warning | ... | Could not fix |

### Changes Summary

```bash
git diff --stat
```

### Issues Requiring Manual Intervention

List any issues that couldn't be auto-fixed:
- [file:line] Reason why manual fix is needed

### Verification

- **Syntax:** Pass / Fail
- **Tests:** Pass / Fail / Skipped
- **Files modified:** N

### Next Steps

- If all fixed and verified: Ready for commit
- If some failed: List what needs manual attention
- If tests fail: Show failure output

## Safety

- Never fix suggestions unless `--all` is explicitly passed
- Never modify security-critical code without clear fix path
- Stop and report if fixes cause test failures
- Don't attempt recursive fixing of new issues
