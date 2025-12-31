---
description: Schedule an interview for a candidate
argument-hint: [candidate-or-application-id]
allowed-tools: mcp__ashby__*
---

Help the user schedule an interview in Ashby.

## Identify the Application

If an ID was provided ($ARGUMENTS):
- If it looks like an application ID (UUID), use `application_info` to verify
- If it looks like a candidate name/email, search and find their active applications

If no argument provided, ask the user:
1. Search for candidate by name or email
2. Enter application ID directly
3. Browse recent applications

## Gather Interview Details

Once application is identified, collect interview information.

Ask the user for:

1. **Interview date and time**
   - Date (YYYY-MM-DD format)
   - Start time (HH:MM in user's timezone)
   - Duration (default 60 minutes)

2. **Interviewers**
   - Search for interviewers using `user_search`
   - Or list available users with `user_list`
   - Allow selecting multiple interviewers

3. **Interview stage** (optional)
   - Get stages using `interview_stage_list`
   - Suggest appropriate stage based on candidate's current stage

## Create the Schedule

Once all details collected:

1. Convert times to ISO 8601 format (use Z for UTC or include timezone offset)
2. Call `interview_schedule_create` with:
   - applicationId
   - interviewerUserIds (array)
   - startTime
   - endTime (calculated from start + duration)
   - interviewStageId (if provided)

## Confirm and Follow-up

After scheduling:
- Confirm the interview details
- Show interviewer names and times
- Offer to:
  - Schedule another interview
  - Add notes to the candidate
  - View the full interview schedule

## Rescheduling

If user mentions rescheduling:
1. Get existing schedules using `interview_schedule_list`
2. Ask which interview to modify
3. Use `interview_schedule_update` with new times
4. Or use `interview_schedule_cancel` if canceling

## Example Workflow

```
User: /schedule john@example.com

1. Search: candidate_search(email="john@example.com")
2. Find application: application_list(candidateId=...)
3. Ask: "When would you like to schedule the interview?"
4. Ask: "Who should be the interviewers?"
5. Search interviewers: user_search(name="...")
6. Confirm details
7. Create: interview_schedule_create(...)
8. Report success
```
