# /// script
# dependencies = [
#   "mcp>=1.0.0",
#   "requests>=2.31.0",
#   "python-dotenv>=1.0.0"
# ]
# ///
"""
Ashby MCP Server - Comprehensive ATS integration for Claude Code

Provides 34 core tools for managing:
- Candidates: create, search, list, update, notes, tags, resumes
- Jobs: create, search, list, update, status
- Applications: create, list, update, stage changes, source tracking
- Interviews: schedules, lists, updates, cancellations
- Feedback: list feedback, review forms
- Organization: users, departments, locations
- Offers: create, list
"""

import asyncio
import json
import base64
from typing import Any, Optional
import os
from dotenv import load_dotenv
import requests

import mcp.types as types
from mcp.server import Server
import mcp.server.stdio


class AshbyClient:
    """Handles Ashby API operations."""

    def __init__(self):
        self.api_key: Optional[str] = None
        self.base_url = "https://api.ashbyhq.com"
        self.headers = {}

    def connect(self) -> bool:
        """Establishes connection to Ashby using API key from environment."""
        try:
            self.api_key = os.getenv('ASHBY_API_KEY')
            if not self.api_key:
                raise ValueError("ASHBY_API_KEY environment variable not set")

            # Ashby uses Basic Auth with API key as username, empty password
            auth_string = base64.b64encode(f"{self.api_key}:".encode()).decode()
            self.headers = {
                "Authorization": f"Basic {auth_string}",
                "Content-Type": "application/json"
            }
            return True
        except Exception as e:
            print(f"Ashby connection failed: {str(e)}")
            return False

    def _make_request(self, endpoint: str, data: Optional[dict] = None) -> dict:
        """Make a POST request to the Ashby API (all Ashby endpoints use POST)."""
        if not self.api_key:
            raise ValueError("Ashby connection not established")

        url = f"{self.base_url}{endpoint}"
        response = requests.post(
            url=url,
            headers=self.headers,
            json=data or {}
        )
        response.raise_for_status()
        return response.json()


# Create server instance
server = Server("ashby-mcp")

# Load environment variables
load_dotenv()

# Configure Ashby client
ashby_client = AshbyClient()
if not ashby_client.connect():
    print("Warning: Ashby connection not initialized - set ASHBY_API_KEY")


# =============================================================================
# TOOL DEFINITIONS (~30 core tools)
# =============================================================================

TOOLS = [
    # -------------------------------------------------------------------------
    # CANDIDATE TOOLS (8)
    # -------------------------------------------------------------------------
    types.Tool(
        name="candidate_create",
        description="Create a new candidate in Ashby. Returns the created candidate with ID.",
        inputSchema={
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Candidate's full name"},
                "email": {"type": "string", "description": "Candidate's email address"},
                "phoneNumber": {"type": "string", "description": "Candidate's phone number"},
                "linkedInUrl": {"type": "string", "description": "LinkedIn profile URL"},
                "location": {"type": "string", "description": "Candidate's location"},
                "sourceId": {"type": "string", "description": "Source ID for attribution"}
            },
            "required": ["name", "email"]
        }
    ),
    types.Tool(
        name="candidate_search",
        description="Search for candidates by email or name. Use for finding specific candidates.",
        inputSchema={
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Email to search for (exact match)"},
                "name": {"type": "string", "description": "Name to search for (partial match)"}
            }
        }
    ),
    types.Tool(
        name="candidate_list",
        description="List all candidates with pagination. Use cursor for subsequent pages.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor from previous response"},
                "limit": {"type": "integer", "description": "Number of results (max 100)", "default": 50}
            }
        }
    ),
    types.Tool(
        name="candidate_info",
        description="Get detailed information about a specific candidate by ID.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's unique ID"}
            },
            "required": ["candidateId"]
        }
    ),
    types.Tool(
        name="candidate_update",
        description="Update an existing candidate's information.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's unique ID"},
                "name": {"type": "string", "description": "Updated name"},
                "email": {"type": "string", "description": "Updated email"},
                "phoneNumber": {"type": "string", "description": "Updated phone"},
                "linkedInUrl": {"type": "string", "description": "Updated LinkedIn URL"},
                "location": {"type": "string", "description": "Updated location"}
            },
            "required": ["candidateId"]
        }
    ),
    types.Tool(
        name="candidate_add_note",
        description="Add a note to a candidate's profile.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's unique ID"},
                "note": {"type": "string", "description": "The note content"},
                "sendNotifications": {"type": "boolean", "description": "Send notifications about the note", "default": False}
            },
            "required": ["candidateId", "note"]
        }
    ),
    types.Tool(
        name="candidate_add_tag",
        description="Add a tag to a candidate for organization/filtering.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's unique ID"},
                "tagId": {"type": "string", "description": "The tag ID to add"}
            },
            "required": ["candidateId", "tagId"]
        }
    ),
    types.Tool(
        name="candidate_list_notes",
        description="List all notes on a candidate's profile.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's unique ID"}
            },
            "required": ["candidateId"]
        }
    ),

    # -------------------------------------------------------------------------
    # JOB TOOLS (5)
    # -------------------------------------------------------------------------
    types.Tool(
        name="job_create",
        description="Create a new job posting in Ashby.",
        inputSchema={
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Job title"},
                "departmentId": {"type": "string", "description": "Department ID"},
                "locationId": {"type": "string", "description": "Location ID"},
                "employmentType": {"type": "string", "description": "Full-time, Part-time, Contract, etc."},
                "description": {"type": "string", "description": "Job description (HTML supported)"}
            },
            "required": ["title"]
        }
    ),
    types.Tool(
        name="job_search",
        description="Search for jobs by title or filters.",
        inputSchema={
            "type": "object",
            "properties": {
                "title": {"type": "string", "description": "Job title to search for"},
                "status": {"type": "string", "description": "Filter by status: Open, Closed, Draft, Archived"},
                "departmentId": {"type": "string", "description": "Filter by department ID"},
                "locationId": {"type": "string", "description": "Filter by location ID"}
            }
        }
    ),
    types.Tool(
        name="job_list",
        description="List all jobs with pagination.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results (max 100)", "default": 50},
                "includeArchived": {"type": "boolean", "description": "Include archived jobs", "default": False}
            }
        }
    ),
    types.Tool(
        name="job_info",
        description="Get detailed information about a specific job.",
        inputSchema={
            "type": "object",
            "properties": {
                "jobId": {"type": "string", "description": "The job's unique ID"}
            },
            "required": ["jobId"]
        }
    ),
    types.Tool(
        name="job_set_status",
        description="Update a job's status (Open, Closed, Draft, Archived).",
        inputSchema={
            "type": "object",
            "properties": {
                "jobId": {"type": "string", "description": "The job's unique ID"},
                "status": {"type": "string", "description": "New status: Open, Closed, Draft, Archived"}
            },
            "required": ["jobId", "status"]
        }
    ),

    # -------------------------------------------------------------------------
    # APPLICATION TOOLS (6)
    # -------------------------------------------------------------------------
    types.Tool(
        name="application_create",
        description="Create an application - consider a candidate for a job.",
        inputSchema={
            "type": "object",
            "properties": {
                "candidateId": {"type": "string", "description": "The candidate's ID"},
                "jobId": {"type": "string", "description": "The job's ID"},
                "sourceId": {"type": "string", "description": "Application source ID"},
                "interviewStageId": {"type": "string", "description": "Initial interview stage ID"}
            },
            "required": ["candidateId", "jobId"]
        }
    ),
    types.Tool(
        name="application_list",
        description="List applications with filtering and pagination.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results (max 100)", "default": 50},
                "jobId": {"type": "string", "description": "Filter by job ID"},
                "candidateId": {"type": "string", "description": "Filter by candidate ID"},
                "status": {"type": "string", "description": "Filter by status: Active, Hired, Archived"}
            }
        }
    ),
    types.Tool(
        name="application_info",
        description="Get detailed information about a specific application.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application's unique ID"}
            },
            "required": ["applicationId"]
        }
    ),
    types.Tool(
        name="application_change_stage",
        description="Move an application to a different interview stage.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application's ID"},
                "interviewStageId": {"type": "string", "description": "Target interview stage ID"},
                "archiveReasonId": {"type": "string", "description": "Required when moving to Archived stage"}
            },
            "required": ["applicationId", "interviewStageId"]
        }
    ),
    types.Tool(
        name="application_change_source",
        description="Update the source attribution for an application.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application's ID"},
                "sourceId": {"type": "string", "description": "New source ID (null to clear)"}
            },
            "required": ["applicationId", "sourceId"]
        }
    ),
    types.Tool(
        name="application_update",
        description="Update application properties.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application's ID"},
                "creditedToUserId": {"type": "string", "description": "User to credit the application to"}
            },
            "required": ["applicationId"]
        }
    ),

    # -------------------------------------------------------------------------
    # INTERVIEW TOOLS (5)
    # -------------------------------------------------------------------------
    types.Tool(
        name="interview_list",
        description="List interviews with optional filtering.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results", "default": 50},
                "applicationId": {"type": "string", "description": "Filter by application ID"}
            }
        }
    ),
    types.Tool(
        name="interview_schedule_create",
        description="Create/schedule a new interview.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "Application ID for this interview"},
                "interviewerUserIds": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of interviewer user IDs"
                },
                "startTime": {"type": "string", "description": "ISO 8601 start time"},
                "endTime": {"type": "string", "description": "ISO 8601 end time"},
                "interviewStageId": {"type": "string", "description": "Interview stage ID"},
                "feedbackFormDefinitionId": {"type": "string", "description": "Feedback form to use"}
            },
            "required": ["applicationId", "interviewerUserIds", "startTime", "endTime"]
        }
    ),
    types.Tool(
        name="interview_schedule_list",
        description="List scheduled interviews with filtering.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results", "default": 50},
                "startTimeAfter": {"type": "string", "description": "Filter: start time after (ISO 8601)"},
                "startTimeBefore": {"type": "string", "description": "Filter: start time before (ISO 8601)"}
            }
        }
    ),
    types.Tool(
        name="interview_schedule_update",
        description="Update an existing interview schedule.",
        inputSchema={
            "type": "object",
            "properties": {
                "interviewScheduleId": {"type": "string", "description": "The schedule ID to update"},
                "startTime": {"type": "string", "description": "New start time (ISO 8601)"},
                "endTime": {"type": "string", "description": "New end time (ISO 8601)"},
                "interviewerUserIds": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Updated list of interviewer IDs"
                }
            },
            "required": ["interviewScheduleId"]
        }
    ),
    types.Tool(
        name="interview_schedule_cancel",
        description="Cancel a scheduled interview.",
        inputSchema={
            "type": "object",
            "properties": {
                "interviewScheduleId": {"type": "string", "description": "The schedule ID to cancel"},
                "reason": {"type": "string", "description": "Cancellation reason"}
            },
            "required": ["interviewScheduleId"]
        }
    ),

    # -------------------------------------------------------------------------
    # ORGANIZATION TOOLS (4)
    # -------------------------------------------------------------------------
    types.Tool(
        name="user_list",
        description="List all users in the Ashby organization.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results", "default": 50},
                "includeDeactivated": {"type": "boolean", "description": "Include deactivated users", "default": False}
            }
        }
    ),
    types.Tool(
        name="user_search",
        description="Search for users by email or name.",
        inputSchema={
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Email to search for"},
                "name": {"type": "string", "description": "Name to search for"}
            }
        }
    ),
    types.Tool(
        name="department_list",
        description="List all departments in the organization.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "includeArchived": {"type": "boolean", "description": "Include archived departments", "default": False}
            }
        }
    ),
    types.Tool(
        name="location_list",
        description="List all locations in the organization.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "includeArchived": {"type": "boolean", "description": "Include archived locations", "default": False}
            }
        }
    ),

    # -------------------------------------------------------------------------
    # OFFER TOOLS (2)
    # -------------------------------------------------------------------------
    types.Tool(
        name="offer_create",
        description="Create an offer for an application.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application ID"},
                "startDate": {"type": "string", "description": "Offer start date (ISO 8601)"},
                "offerDetails": {"type": "string", "description": "Offer details/notes"}
            },
            "required": ["applicationId"]
        }
    ),
    types.Tool(
        name="offer_list",
        description="List offers with filtering.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"},
                "limit": {"type": "integer", "description": "Number of results", "default": 50},
                "applicationId": {"type": "string", "description": "Filter by application ID"}
            }
        }
    ),

    # -------------------------------------------------------------------------
    # UTILITY TOOLS (2)
    # -------------------------------------------------------------------------
    types.Tool(
        name="interview_stage_list",
        description="List all interview stages for a job's interview plan.",
        inputSchema={
            "type": "object",
            "properties": {
                "jobId": {"type": "string", "description": "The job ID to get stages for"}
            }
        }
    ),
    types.Tool(
        name="source_list",
        description="List all candidate sources (for attribution).",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"}
            }
        }
    ),
    types.Tool(
        name="candidate_tag_list",
        description="List all available candidate tags.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"}
            }
        }
    ),
    types.Tool(
        name="archive_reason_list",
        description="List all archive reasons (for rejecting applications).",
        inputSchema={
            "type": "object",
            "properties": {}
        }
    ),

    # -------------------------------------------------------------------------
    # FEEDBACK TOOLS (2) - For reviewing candidates
    # -------------------------------------------------------------------------
    types.Tool(
        name="feedback_list",
        description="List all feedback submitted for an application. Use to review interviewer assessments.",
        inputSchema={
            "type": "object",
            "properties": {
                "applicationId": {"type": "string", "description": "The application ID to get feedback for"}
            },
            "required": ["applicationId"]
        }
    ),
    types.Tool(
        name="feedback_form_list",
        description="List available feedback form definitions. Shows what forms are used for collecting interviewer feedback.",
        inputSchema={
            "type": "object",
            "properties": {
                "cursor": {"type": "string", "description": "Pagination cursor"}
            }
        }
    ),
]


@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available Ashby tools."""
    return TOOLS


# =============================================================================
# TOOL ENDPOINT MAPPING
# =============================================================================

ENDPOINT_MAP = {
    # Candidates
    "candidate_create": "/candidate.create",
    "candidate_search": "/candidate.search",
    "candidate_list": "/candidate.list",
    "candidate_info": "/candidate.info",
    "candidate_update": "/candidate.update",
    "candidate_add_note": "/candidate.createNote",
    "candidate_add_tag": "/candidate.addTag",
    "candidate_list_notes": "/candidate.listNotes",

    # Jobs
    "job_create": "/job.create",
    "job_search": "/job.search",
    "job_list": "/job.list",
    "job_info": "/job.info",
    "job_set_status": "/job.setStatus",

    # Applications
    "application_create": "/application.create",
    "application_list": "/application.list",
    "application_info": "/application.info",
    "application_change_stage": "/application.change_stage",
    "application_change_source": "/application.change_source",
    "application_update": "/application.update",

    # Interviews
    "interview_list": "/interview.list",
    "interview_schedule_create": "/interviewSchedule.create",
    "interview_schedule_list": "/interviewSchedule.list",
    "interview_schedule_update": "/interviewSchedule.update",
    "interview_schedule_cancel": "/interviewSchedule.cancel",

    # Organization
    "user_list": "/user.list",
    "user_search": "/user.search",
    "department_list": "/department.list",
    "location_list": "/location.list",

    # Offers
    "offer_create": "/offer.create",
    "offer_list": "/offer.list",

    # Utilities
    "interview_stage_list": "/interviewStage.list",
    "source_list": "/source.list",
    "candidate_tag_list": "/candidateTag.list",
    "archive_reason_list": "/archiveReason.list",

    # Feedback
    "feedback_list": "/applicationFeedback.list",
    "feedback_form_list": "/feedbackFormDefinition.list",
}


@server.call_tool()
async def handle_call_tool(name: str, arguments: dict[str, Any]) -> list[types.TextContent]:
    """Handle tool calls by routing to Ashby API endpoints."""
    try:
        endpoint = ENDPOINT_MAP.get(name)
        if not endpoint:
            raise ValueError(f"Unknown tool: {name}")

        response = ashby_client._make_request(endpoint, data=arguments)

        # Format response nicely
        if response.get("success"):
            results = response.get("results", response)
            return [types.TextContent(
                type="text",
                text=json.dumps(results, indent=2)
            )]
        else:
            errors = response.get("errors", ["Unknown error"])
            return [types.TextContent(
                type="text",
                text=f"Error: {json.dumps(errors)}"
            )]

    except requests.exceptions.HTTPError as e:
        return [types.TextContent(
            type="text",
            text=f"HTTP Error: {e.response.status_code} - {e.response.text}"
        )]
    except Exception as e:
        return [types.TextContent(
            type="text",
            text=f"Error executing {name}: {str(e)}"
        )]


async def run():
    """Run the MCP server."""
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(run())
