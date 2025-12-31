---
description: Thorough senior engineer PR review with actionable feedback
argument-hint: <pr-url-or-number>
allowed-tools: Bash, Read, Grep, Glob, WebFetch, mcp__plugin_context7_context7__resolve-library-id, mcp__plugin_context7_context7__get-library-docs
---

# Pull Request Review

Use extended thinking. Review like a senior engineer who will be paged at 3am if this breaks:

1. **Correctness**: Does it actually do what it claims? Logic errors?
2. **Edge cases**: Empty inputs, nulls, large data, concurrent access?
3. **Security**: SQL injection, XSS, auth bypass, secrets exposure?
4. **Performance**: O(n^2) loops, N+1 queries, memory leaks?
5. **Reliability**: Error handling, retries, timeouts?
6. **Backwards compatibility**: Will this break existing clients/data?
7. **Test coverage**: Are tests actually testing the right things?

## Step 1: Fetch PR Information

```bash
gh pr view $ARGUMENTS --json title,body,baseRefName,headRefName,files,additions,deletions,author
gh pr diff $ARGUMENTS
gh pr checks $ARGUMENTS
```

## Step 2: Understand Context

1. Read the PR description thoroughly
2. Check for linked issues
3. Understand what problem is being solved

## Step 3: Technology Assessment

For unfamiliar libraries in changed files, fetch Context7 docs to understand correct usage patterns.

## Step 4: Systematic Review

### Security Checklist
- [ ] No hardcoded secrets or API keys
- [ ] User input validated and sanitized
- [ ] SQL uses parameterization
- [ ] File paths validated (no traversal)
- [ ] Auth checks present where needed
- [ ] Sensitive data not logged

### Performance
- [ ] No O(n^2) on large datasets
- [ ] Database queries indexed, no N+1
- [ ] No blocking operations in async contexts

### Error Handling
- [ ] Errors caught and handled (not swallowed)
- [ ] Failure modes are graceful

## Step 5: Test Review

- Do tests cover happy path AND error cases?
- Are edge cases tested?
- Could tests pass even if code is wrong?

## Step 6: Compose Review

### Must Fix (Blocking)
Security vulnerabilities, correctness bugs, data loss risks, breaking changes

### Should Fix (Non-blocking)
Performance concerns, missing error handling, test gaps

### Suggestions (Optional)
Code organization, naming, documentation

### Questions
Things needing clarification before approval

## Step 7: Submit Review

```bash
gh pr review $ARGUMENTS --comment --body "..."
# OR
gh pr review $ARGUMENTS --request-changes --body "..."
# OR
gh pr review $ARGUMENTS --approve --body "..."
```
