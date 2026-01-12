---
name: jobs
description: This skill should be used when the user asks to "list jobs", "find jobs", "view open positions", "search roles", or wants to search and list jobs in Ashby ATS.
---

Help search and view jobs in Ashby.

## Actions Available

1. List all open jobs
2. Search by title
3. View all jobs including closed/archived
4. View a specific job by ID

## Display Format

When displaying job results, show:
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

## Follow-up Actions

Offer to:
- View applications for a job
- Change job status
- View interview stages/pipeline
