---
description: Search and list jobs in Ashby
argument-hint: [search-term]
allowed-tools: mcp__ashby__*
---

Help the user search and view jobs in Ashby.

If a search term was provided ($ARGUMENTS), search for jobs using `job_search` with the title parameter.

If no search term provided, ask the user what they want to do:
1. List all open jobs
2. Search by title
3. View all jobs including closed/archived
4. View a specific job by ID

For list operations:
- Default to showing only Open status jobs
- Offer to include archived jobs if user wants

When displaying job results, format clearly showing:
- Title
- Status (Open, Closed, Draft, Archived)
- Department (if available)
- Location (if available)
- Number of active applications

If viewing a specific job:
- Show full job details using `job_info`
- Get interview stages using `interview_stage_list`
- Show application count by stage
- List recent applications if requested

Offer to:
- View applications for a job
- Change job status
- View interview stages/pipeline
