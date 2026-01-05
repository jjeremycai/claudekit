---
description: View and manage the recruiting pipeline for a job
argument-hint: [job-id-or-title]
allowed-tools: mcp__ashby__*
---

Help the user view and manage the recruiting pipeline in Ashby.

## Identify the Job

If a job ID or title was provided ($ARGUMENTS):
- If it looks like a UUID, use it directly as job ID
- Otherwise, search for jobs using `job_search` with the title
- If multiple matches, ask user to select one

If no argument provided, ask the user:
1. Which job to view the pipeline for
2. Or list open jobs to choose from

## Display Pipeline

Once job is identified:

1. Get interview stages using `interview_stage_list` for the job
2. Get active applications using `application_list` filtered by jobId and status="Active"
3. Group applications by their current stage
4. Display pipeline visualization:

```
Pipeline for [Job Title]:

Lead (3)
├── Jane Smith - Applied 2 days ago
├── John Doe - Applied 5 days ago
└── Alice Brown - Applied 1 week ago

Phone Screen (2)
├── Bob Wilson - In stage 3 days
└── Carol Davis - In stage 1 day

Onsite (1)
└── Eve Johnson - In stage 2 days

Offer (0)
```

## Actions

After displaying pipeline, ask what the user wants to do:
1. Move a candidate to next stage
2. View candidate details
3. Archive (reject) a candidate
4. Schedule interview for a candidate
5. Add note to a candidate
6. Refresh pipeline view

For stage changes:
- Use `application_change_stage` with appropriate stage ID
- If moving to archived stage, get archive reasons using `archive_reason_list` and let user select

For viewing details:
- Use `application_info` to get full application details
- Use `candidate_info` for candidate details
