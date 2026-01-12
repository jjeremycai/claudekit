---
name: schedule
description: This skill should be used when the user asks to "schedule interview", "book interview", "set up interview time", "arrange interview", or wants to schedule an interview for a candidate in Ashby.
---

Help schedule an interview in Ashby.

## Identify the Application

- If it looks like an application ID (UUID), use `application_info` to verify
- If it looks like a candidate name/email, search and find their active applications

## Gather Interview Details

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

1. Convert times to ISO 8601 format
2. Call `interview_schedule_create` with:
   - applicationId
   - interviewerUserIds (array)
   - startTime
   - endTime (calculated from start + duration)
   - interviewStageId (if provided)

## Follow-up

After scheduling:
- Confirm the interview details
- Show interviewer names and times
- Offer to schedule another, add notes, or view full schedule

## Rescheduling

If rescheduling:
1. Get existing schedules using `interview_schedule_list`
2. Ask which interview to modify
3. Use `interview_schedule_update` with new times
4. Or use `interview_schedule_cancel` if canceling
