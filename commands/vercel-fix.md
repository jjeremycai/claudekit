---
description: Debug and fix Vercel deployment failures iteratively
---

# Vercel Fix

Debug and fix a failed Vercel deployment. Loops until success or user decides to stop.

## Instructions

Launch the `vercel-debugger` agent to handle this iteratively:

```
Task: vercel-debugger
Prompt: |
  Debug the failed Vercel deployment. Follow this loop:

  1. **Get logs** - Fetch the failed deployment logs
  2. **Diagnose** - Identify the root cause
  3. **Fix** - Implement the fix
  4. **Redeploy** - Push changes and wait for build to complete
  5. **Check result**:
     - If SUCCESS → Report what was fixed and exit
     - If FAIL → Use AskUserQuestion with these options:
       - "Try again" - Attempt another fix
       - "Show me the error" - Display full error for manual review
       - "Stop" - Exit and let user handle manually

  Keep looping until success or user chooses to stop.

  When asking the user after a failure, include:
  - What you tried
  - The new error (brief summary)
  - How many attempts so far
```
