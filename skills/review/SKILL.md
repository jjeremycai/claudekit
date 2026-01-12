---
name: review
description: This skill should be used when the user asks to "review code", "check for bugs", "review my changes", "review this PR", "code review", or mentions reviewing code quality, security issues, or codebase fit. Launches parallel @code-reviewer subagents to find bugs, security issues, and pattern violations.
---

Review code changes using THREE (3) @code-reviewer subagents and correlate results into a summary ranked by severity.

## What to Review

Review uncommitted changes by default. If no uncommitted changes, review the last commit. If a PR is provided, fetch and review it.

```bash
# Check for uncommitted changes
git status --porcelain

# If uncommitted changes exist
git diff
git diff --staged

# If no uncommitted changes, review last commit
git show HEAD --stat
git diff HEAD~1..HEAD

# If PR provided
gh pr view <pr-number> --json title,body,baseRefName,headRefName
gh pr diff <pr-number>
```

## Standard Review

Launch 3 parallel @code-reviewer subagents with different focus areas:

1. **Agent #1: Bug Hunter** — Logic errors, edge cases, error handling. Ask: What would break this? What assumptions are unstated?
2. **Agent #2: Security & Adversarial** — Vulnerabilities, trust boundaries, failure modes. Ask: What would a malicious caller do? Does it fail open or closed?
3. **Agent #3: Codebase Fit** — Patterns, conventions, CLAUDE.md compliance. Ask: Is complexity justified? What would a tired maintainer misunderstand?

Each agent should read the full files being modified (not just diffs) and return issues with:
- File path and line number
- Severity (critical/warning/suggestion)
- **Assumptions** the code makes (stated or unstated)
- Clear explanation of the problem — name the realistic scenario
- Suggested fix if applicable

## Output Format

### Assumptions Surfaced

List key assumptions the code makes about input, environment, and state. Unstated assumptions are future bugs.

### Issues Found

Correlate all agent findings, deduplicate, rank by severity:

**Critical** (must fix before merge)
- [file:line] Issue description — realistic scenario

**Warnings** (should fix)
- [file:line] Issue description — realistic scenario

**Suggestions** (consider)
- [file:line] Issue description

### Recommendation

- **Ready to merge** — No critical issues, CI passing
- **Changes needed** — Critical issues or unaddressed feedback
- **Needs discussion** — Fundamental approach questions

## Next Actions

After presenting the review summary, prompt for next action:

**If critical or warning issues were found:**

Use AskUserQuestion to offer:
- **Run /fix (Recommended)** — Auto-fix critical and warning issues using @engineer agents
- **Run /fix --critical-only** — Only fix critical issues, skip warnings
- **Skip fixes** — User will fix manually

If user selects a fix option, invoke: `Skill: fix`

**If no critical/warning issues:**

Skip the prompt - review is complete. Code is ready to merge.
