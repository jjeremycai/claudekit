---
name: candidates
description: This skill should be used when the user asks to "find candidates", "search candidates", "look up candidate", "view applicant", or wants to search and list candidates in Ashby ATS.
---

Help search and view candidates in Ashby.

## Search Options

- If it looks like an email (contains @), use `candidate_search` with the email parameter
- Otherwise, use `candidate_search` with the name parameter

## Actions Available

1. Search by email
2. Search by name
3. List all candidates (with pagination)
4. View a specific candidate by ID

## Display Format

When displaying results, show:
- Name
- Email
- Location (if available)
- Number of active applications
- Created date

If viewing a specific candidate, also show:
- All notes (using `candidate_list_notes`)
- Tags
- Applications and their current stages
