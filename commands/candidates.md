---
description: Search and list candidates in Ashby
argument-hint: [search-term]
allowed-tools: mcp__ashby__*
---

Help the user search and view candidates in Ashby.

If a search term was provided ($ARGUMENTS), search for candidates:
- If it looks like an email (contains @), use `candidate_search` with the email parameter
- Otherwise, use `candidate_search` with the name parameter

If no search term provided, ask the user what they want to do:
1. Search by email
2. Search by name
3. List all candidates (with pagination)
4. View a specific candidate by ID

For list operations, offer to show more results if pagination is available.

When displaying results, format them clearly showing:
- Name
- Email
- Location (if available)
- Number of active applications
- Created date

If viewing a specific candidate, also show:
- All notes (using `candidate_list_notes`)
- Tags
- Applications and their current stages
