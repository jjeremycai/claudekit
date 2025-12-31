# Ashby Plugin for Claude Code

Comprehensive Ashby ATS integration for recruiting workflows. Manage candidates, jobs, applications, interviews, and offers directly from Claude Code.

## Features

- **30 MCP Tools** covering core Ashby operations
- **Interactive Commands** for quick candidate/job searches
- **Recruiting Skills** for workflow guidance
- **Proactive Agent** for pipeline management

## Prerequisites

1. **Ashby API Key**: Generate in Ashby: Settings → API Keys
2. **Python 3.10+**: Required for MCP server
3. **uv**: Python package manager (`pip install uv` or `brew install uv`)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/jjeremycai/ashby-plugin.git
cd ashby-plugin
```

### 2. Install the MCP server dependencies

```bash
cd mcp-server
uv sync
cd ..
```

### 3. Configure your Ashby API key

Create a `.env` file in the `mcp-server` directory:

```bash
echo 'ASHBY_API_KEY=your-api-key-here' > mcp-server/.env
```

Or set it as an environment variable:

```bash
export ASHBY_API_KEY="your-api-key-here"
```

### 4. Install the plugin

**Option A: Run with plugin directory flag**

```bash
claude --plugin-dir /path/to/ashby-plugin
```

**Option B: Install globally**

Copy to your Claude Code plugins directory:

```bash
cp -r ashby-plugin ~/.claude/plugins/ashby
```

Then add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "plugins": ["~/.claude/plugins/ashby"]
}
```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `/candidates [search]` | Search and list candidates |
| `/jobs [search]` | Search and list jobs |
| `/pipeline [job]` | View recruiting pipeline |
| `/schedule [candidate]` | Schedule an interview |

### Tools

The MCP server provides 30+ tools organized by category:

**Candidates**: `candidate_create`, `candidate_search`, `candidate_list`, `candidate_info`, `candidate_update`, `candidate_add_note`, `candidate_add_tag`, `candidate_list_notes`

**Jobs**: `job_create`, `job_search`, `job_list`, `job_info`, `job_set_status`

**Applications**: `application_create`, `application_list`, `application_info`, `application_change_stage`, `application_change_source`, `application_update`

**Interviews**: `interview_list`, `interview_schedule_create`, `interview_schedule_list`, `interview_schedule_update`, `interview_schedule_cancel`

**Organization**: `user_list`, `user_search`, `department_list`, `location_list`

**Offers**: `offer_create`, `offer_list`

**Utilities**: `interview_stage_list`, `source_list`, `candidate_tag_list`, `archive_reason_list`

### Skills

- **ashby-workflows**: Pipeline management and recruiting best practices
- **ashby-api-guide**: API documentation and tool usage

### Agent

The **recruiting-assistant** agent triggers automatically when you mention:
- Moving candidates through stages
- Scheduling interviews
- Reviewing pipeline status
- Hiring progress

## Examples

### Search for a candidate

```
"Find candidate john@example.com"
```

### Move candidate to next stage

```
"Advance Jane Smith to the onsite interview"
```

### View pipeline

```
"Show me the pipeline for Senior Engineer role"
```

### Schedule interview

```
"Schedule a phone screen with the new candidate tomorrow at 2pm"
```

## API Permissions

Ensure your API key has these permissions:
- `candidatesRead` / `candidatesWrite`
- `jobsRead` / `jobsWrite`
- `interviewsWrite`

## Troubleshooting

**MCP server not starting:**
- Ensure Python 3.10+ is installed
- Verify `uv` is available in PATH
- Check ASHBY_API_KEY is set

**Authentication errors:**
- Verify API key is valid
- Check key has required permissions
- Ensure key is not expired

**Tool errors:**
- Check Ashby API status
- Verify resource IDs are correct
- Review rate limits (100 req/min)

## Development

### MCP Server Structure

```
mcp-server/
├── pyproject.toml    # Dependencies
└── server.py         # MCP server implementation
```

### Adding New Tools

1. Add tool definition to `TOOLS` list in `server.py`
2. Add endpoint mapping to `ENDPOINT_MAP`
3. Test with Claude Code

## License

MIT
