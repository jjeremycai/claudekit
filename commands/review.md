---
description: Review code changes with @code-reviewer subagents
argument-hint: [pr-url-or-number] [--verify]
agent: plan
allowed-tools: Bash, Read, Grep, Glob, Task, WebFetch, mcp__claude-in-chrome__*, mcp__plugin_context7_context7__resolve-library-id, mcp__plugin_context7_context7__get-library-docs
---

Review the code changes using THREE (3) @code-reviewer subagents and correlate results into a summary ranked by severity. Use the provided user guidance to steer the review and focus on specific code paths, changes, and/or areas of concern.

Guidance: $ARGUMENTS

## Mode Detection

- `--verify` flag: Verification mode (check if PR feedback was addressed)
- No flag: Standard review mode

## What to Review

Review uncommitted changes by default. If no uncommitted changes, review the last commit. If the user provides a pull request/merge request number or link, use CLI tools to fetch it and then perform your review.

```bash
# Check for uncommitted changes
git status --porcelain

# If uncommitted changes exist
git diff
git diff --staged

# If no uncommitted changes, review last commit
git show HEAD --stat
git diff HEAD~1..HEAD

# If PR provided (extract number from $ARGUMENTS)
gh pr view <pr-number> --json title,body,baseRefName,headRefName
gh pr diff <pr-number>
```

## Standard Review

Launch 3 parallel @code-reviewer subagents with different focus areas:

1. **Agent #1: Bug Hunter** — Logic errors, edge cases, error handling
2. **Agent #2: Security & Performance** — Vulnerabilities, O(n²) issues, N+1 queries
3. **Agent #3: Codebase Fit** — Patterns, conventions, CLAUDE.md compliance

Each agent should read the full files being modified (not just diffs) and return issues with:
- File path and line number
- Severity (critical/warning/suggestion)
- Clear explanation of the problem
- Suggested fix if applicable

## Verification Mode (--verify)

When `--verify` is present, also check:

```bash
# Get PR review comments (replace <pr-number> with actual number from $ARGUMENTS)
gh pr view <pr-number> --comments
gh api repos/:owner/:repo/pulls/<pr-number>/comments --jq '.[] | {path: .path, line: .line, body: .body}'
```

For each issue raised in reviews:
- [ ] **Fixed** — Correctly addressed
- [ ] **Partially fixed** — Attempted but incomplete
- [ ] **Not fixed** — Issue still present
- [ ] **Won't fix** — Valid justification provided

## Visual Testing (UI Changes Only)

If changes affect UI and a dev server is available:

```bash
npm run dev  # or appropriate command
```

Use browser automation to verify:
- `mcp__claude-in-chrome__tabs_create_mcp` — New tab
- `mcp__claude-in-chrome__navigate` — Go to localhost
- `mcp__claude-in-chrome__computer` (screenshot) — Capture state

Skip if: backend-only, docs/config, no dev server.

## Output Format

### Issues Found

Correlate all agent findings, deduplicate, rank by severity:

**Critical** (must fix before merge)
- [file:line] Issue description

**Warnings** (should fix)
- [file:line] Issue description

**Suggestions** (consider)
- [file:line] Issue description

### Verification Status (if --verify)

| Feedback Item | Status | Notes |
|---------------|--------|-------|
| ... | Fixed/Not Fixed | ... |

### Recommendation

- **Ready to merge** — No critical issues, CI passing
- **Changes needed** — Critical issues or unaddressed feedback
- **Needs discussion** — Fundamental approach questions
