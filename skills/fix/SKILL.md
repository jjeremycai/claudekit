---
name: fix
description: This skill should be used when the user asks to "fix the issues", "apply the fixes", "fix what the review found", "auto-fix bugs", or wants to execute fixes for issues identified by a prior code review. Spawns @engineer subagents to fix issues in parallel.
---

Execute fixes for code issues identified by a prior review. This skill assumes a review has already been run and its output is available in the conversation.

## Prerequisites

This skill expects review output in the conversation containing:
- Issues with file paths and line numbers
- Severity levels (critical/warning/suggestion)
- Issue descriptions with realistic scenarios
- Suggested fixes (if provided)

If no review output is found, prompt the user to run a review first.

## Execution

### 1. Parse Review Output

Extract fixable issues from the prior review output:

```
Issues to fix:
- [critical] path/file.ts:123 - Issue description
- [warning] path/file.ts:456 - Issue description
```

Filter by severity:
- Default: Critical + Warning
- Skip suggestions unless explicitly requested

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

Rules:
- Make minimal changes - only fix the reported issues
- Don't refactor or improve adjacent code
- Don't add extra error handling "while you're there"
- Preserve all existing behavior except the bug
- Read the full file first to understand context
```

Spawn agents in parallel for independent files.

### 4. Verification

After all agents complete:

```bash
# Syntax check (TypeScript projects)
npx tsc --noEmit 2>&1 | head -50

# Run tests if available
npm test 2>&1 | head -100

# Show changes
git diff --stat
```

### 5. Simplification

After fixes are verified, run code-simplifier on modified files:

```
Task: code-simplifier:code-simplifier
Prompt: Simplify and refine the code that was just fixed. Focus on recently modified files only.
```

This ensures fixes don't introduce unnecessary complexity.

## Output Format

### Fixes Applied

| File | Line | Severity | Issue | Status |
|------|------|----------|-------|--------|
| path/file.ts | 123 | critical | ... | Fixed |
| path/file.ts | 456 | warning | ... | Fixed |

### Issues Requiring Manual Intervention

List any issues that couldn't be auto-fixed:
- [file:line] Reason why manual fix is needed

### Verification

- **Syntax:** Pass / Fail
- **Tests:** Pass / Fail / Skipped
- **Files modified:** N

## Safety

- Never fix suggestions automatically
- Never modify security-critical code without clear fix path
- Stop and report if fixes cause test failures
