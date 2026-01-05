# Ashby API Patterns Reference

## Pagination Pattern

All list endpoints use cursor-based pagination:

```python
# First page
results = candidate_list(limit=50)
candidates = results["results"]
cursor = results.get("moreDataAvailable") and results.get("nextCursor")

# Subsequent pages
while cursor:
    results = candidate_list(limit=50, cursor=cursor)
    candidates.extend(results["results"])
    cursor = results.get("moreDataAvailable") and results.get("nextCursor")
```

## Error Handling

Ashby API returns errors in a consistent format:

```json
{
  "success": false,
  "errors": ["error_code_1", "error_code_2"]
}
```

Common error codes:
- `invalid_input` - Missing or malformed parameter
- `not_found` - Resource doesn't exist
- `unauthorized` - Permission denied
- `rate_limited` - Too many requests

## ID Resolution

Many operations require IDs. Common resolution patterns:

### Finding Candidate ID by Email

```python
results = candidate_search(email="jane@example.com")
if results["results"]:
    candidate_id = results["results"][0]["id"]
```

### Finding Job ID by Title

```python
results = job_search(title="Senior Engineer")
matching_jobs = [j for j in results["results"] if j["status"] == "Open"]
```

### Finding Stage ID

```python
stages = interview_stage_list(jobId="...")
phone_screen_stage = next(
    s for s in stages["results"]
    if "phone" in s["name"].lower()
)
```

## Batch Operations

For multiple candidates, process sequentially with error handling:

```python
for candidate_data in candidates:
    try:
        result = candidate_create(**candidate_data)
        # Process success
    except Exception as e:
        # Log error, continue with next
        pass
```

## Date/Time Format

All timestamps use ISO 8601 format with timezone:

```
2024-01-15T14:00:00Z        # UTC
2024-01-15T14:00:00-08:00   # Pacific time
```

When creating timestamps in Python:

```python
from datetime import datetime, timezone

now = datetime.now(timezone.utc).isoformat()
```

## Common Filters

### Application Filters

```python
# Active applications for a job
application_list(jobId="...", status="Active")

# All applications for a candidate
application_list(candidateId="...")

# Combined filters
application_list(jobId="...", candidateId="...", status="Active")
```

### Interview Schedule Filters

```python
from datetime import datetime, timedelta

# This week's interviews
interview_schedule_list(
    startTimeAfter=datetime.now().isoformat(),
    startTimeBefore=(datetime.now() + timedelta(days=7)).isoformat()
)
```

### User Filters

```python
# Active users only
user_list(includeDeactivated=False)

# Find by email
user_search(email="interviewer@company.com")
```

## Relationship Traversal

### Candidate → Applications

```python
candidate = candidate_info(candidateId="...")
apps = application_list(candidateId=candidate["id"])
```

### Application → Job

```python
app = application_info(applicationId="...")
job_id = app["job"]["id"]
job = job_info(jobId=job_id)
```

### Job → Interview Stages

```python
job = job_info(jobId="...")
stages = interview_stage_list(jobId=job["id"])
```

## Webhook Events (Reference)

When using webhooks, these events are available:
- `applicationSubmit` - New application
- `candidateStageChange` - Pipeline movement
- `candidateHire` - Offer accepted
- `interviewScheduleCreate` - Interview scheduled
- `offerCreate` - Offer extended

## Rate Limiting

Ashby has rate limits (typically 100 requests/minute). For bulk operations:

```python
import time

for item in items:
    process(item)
    time.sleep(0.1)  # 10 requests/second max
```

## Permission Requirements

Operations require specific permissions:
- `candidatesRead` - View candidates/applications
- `candidatesWrite` - Create/update candidates
- `jobsRead` - View jobs
- `jobsWrite` - Create/update jobs
- `interviewsWrite` - Schedule interviews

Check API key permissions using:

```python
info = apiKey.info()  # Returns permissions list
```
