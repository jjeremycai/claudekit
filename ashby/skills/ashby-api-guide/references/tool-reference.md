# Ashby MCP Tool Reference

Complete parameter reference for all Ashby MCP tools.

## Candidate Tools

### candidate_create

Create a new candidate in Ashby.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Candidate's full name |
| email | string | Yes | Candidate's email address |
| phoneNumber | string | No | Phone number |
| linkedInUrl | string | No | LinkedIn profile URL |
| location | string | No | Location/city |
| sourceId | string | No | Source attribution ID |

**Returns:** Created candidate object with `id`

---

### candidate_search

Search for candidates by email or name.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | No | Exact email match |
| name | string | No | Partial name match |

**Returns:** Array of matching candidates

---

### candidate_list

List all candidates with pagination.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| cursor | string | No | - | Pagination cursor |
| limit | integer | No | 50 | Results per page (max 100) |

**Returns:** Paginated candidate list with `nextCursor`

---

### candidate_info

Get detailed candidate information.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| candidateId | string | Yes | Candidate's unique ID |

**Returns:** Full candidate object with applications, notes, tags

---

### candidate_update

Update existing candidate.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| candidateId | string | Yes | Candidate's unique ID |
| name | string | No | Updated name |
| email | string | No | Updated email |
| phoneNumber | string | No | Updated phone |
| linkedInUrl | string | No | Updated LinkedIn |
| location | string | No | Updated location |

**Returns:** Updated candidate object

---

### candidate_add_note

Add note to candidate profile.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| candidateId | string | Yes | - | Candidate's ID |
| note | string | Yes | - | Note content |
| sendNotifications | boolean | No | false | Notify team |

**Returns:** Created note object

---

### candidate_add_tag

Add tag to candidate.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| candidateId | string | Yes | Candidate's ID |
| tagId | string | Yes | Tag ID to add |

**Returns:** Updated candidate

---

### candidate_list_notes

List all notes on a candidate.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| candidateId | string | Yes | Candidate's ID |

**Returns:** Array of note objects

---

## Job Tools

### job_create

Create new job posting.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Job title |
| departmentId | string | No | Department ID |
| locationId | string | No | Location ID |
| employmentType | string | No | Full-time, Part-time, Contract |
| description | string | No | Job description (HTML supported) |

**Returns:** Created job object

---

### job_search

Search for jobs.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | No | Title search |
| status | string | No | Open, Closed, Draft, Archived |
| departmentId | string | No | Filter by department |
| locationId | string | No | Filter by location |

**Returns:** Array of matching jobs

---

### job_list

List all jobs.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| cursor | string | No | - | Pagination cursor |
| limit | integer | No | 50 | Results per page |
| includeArchived | boolean | No | false | Include archived jobs |

**Returns:** Paginated job list

---

### job_info

Get job details.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job's unique ID |

**Returns:** Full job object

---

### job_set_status

Update job status.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | Yes | Job's ID |
| status | string | Yes | Open, Closed, Draft, Archived |

**Returns:** Updated job

---

## Application Tools

### application_create

Create application (consider candidate for job).

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| candidateId | string | Yes | Candidate's ID |
| jobId | string | Yes | Job's ID |
| sourceId | string | No | Source attribution |
| interviewStageId | string | No | Initial stage |

**Returns:** Created application object

---

### application_list

List applications with filters.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |
| limit | integer | No | Results per page (default 50) |
| jobId | string | No | Filter by job |
| candidateId | string | No | Filter by candidate |
| status | string | No | Active, Hired, Archived |

**Returns:** Paginated application list

---

### application_info

Get application details.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application's ID |

**Returns:** Full application with stage, job, candidate info

---

### application_change_stage

Move application in pipeline.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application's ID |
| interviewStageId | string | Yes | Target stage ID |
| archiveReasonId | string | Conditional | Required for Archived stages |

**Returns:** Updated application

---

### application_change_source

Update source attribution.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application's ID |
| sourceId | string | Yes | New source ID (null to clear) |

**Returns:** Updated application

---

### application_update

Update application properties.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application's ID |
| creditedToUserId | string | No | User to credit |

**Returns:** Updated application

---

## Interview Tools

### interview_list

List interviews.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |
| limit | integer | No | Results per page |
| applicationId | string | No | Filter by application |

**Returns:** Paginated interview list

---

### interview_schedule_create

Schedule new interview.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application ID |
| interviewerUserIds | array[string] | Yes | Interviewer IDs |
| startTime | string | Yes | ISO 8601 start time |
| endTime | string | Yes | ISO 8601 end time |
| interviewStageId | string | No | Stage for this interview |
| feedbackFormDefinitionId | string | No | Feedback form to use |

**Returns:** Created schedule object

---

### interview_schedule_list

List scheduled interviews.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |
| limit | integer | No | Results per page |
| startTimeAfter | string | No | Filter: after this time |
| startTimeBefore | string | No | Filter: before this time |

**Returns:** Paginated schedule list

---

### interview_schedule_update

Update interview schedule.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| interviewScheduleId | string | Yes | Schedule ID |
| startTime | string | No | New start time |
| endTime | string | No | New end time |
| interviewerUserIds | array[string] | No | Updated interviewers |

**Returns:** Updated schedule

---

### interview_schedule_cancel

Cancel scheduled interview.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| interviewScheduleId | string | Yes | Schedule ID |
| reason | string | No | Cancellation reason |

**Returns:** Confirmation

---

## Organization Tools

### user_list

List organization users.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| cursor | string | No | - | Pagination cursor |
| limit | integer | No | 50 | Results per page |
| includeDeactivated | boolean | No | false | Include deactivated |

**Returns:** Paginated user list

---

### user_search

Search for users.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | No | Email search |
| name | string | No | Name search |

**Returns:** Matching users

---

### department_list

List departments.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| cursor | string | No | - | Pagination cursor |
| includeArchived | boolean | No | false | Include archived |

**Returns:** Department list

---

### location_list

List locations.

**Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| cursor | string | No | - | Pagination cursor |
| includeArchived | boolean | No | false | Include archived |

**Returns:** Location list

---

## Offer Tools

### offer_create

Create offer for application.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationId | string | Yes | Application ID |
| startDate | string | No | Proposed start date |
| offerDetails | string | No | Offer notes/details |

**Returns:** Created offer

---

### offer_list

List offers.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |
| limit | integer | No | Results per page |
| applicationId | string | No | Filter by application |

**Returns:** Paginated offer list

---

## Utility Tools

### interview_stage_list

List interview stages for a job.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| jobId | string | No | Filter by job |

**Returns:** Array of stages with types (Lead, Phone Screen, Onsite, Offer, Archived)

---

### source_list

List candidate sources.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |

**Returns:** Paginated source list

---

### candidate_tag_list

List available tags.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| cursor | string | No | Pagination cursor |

**Returns:** Paginated tag list

---

### archive_reason_list

List archive/rejection reasons.

**Parameters:** None

**Returns:** Array of archive reasons
