#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================================================
// Missive API Client
// ============================================================================

const BASE_URL = "https://public.missiveapp.com/v1";
const API_TOKEN = process.env.MISSIVE_API_TOKEN;

if (!API_TOKEN) {
  console.error("MISSIVE_API_TOKEN environment variable is required");
  process.exit(1);
}

// Rate limiting state
let requestQueue: Array<() => Promise<void>> = [];
let activeRequests = 0;
const MAX_CONCURRENT = 5;
const MIN_INTERVAL_MS = 200; // 5 req/sec = 200ms between requests
let lastRequestTime = 0;

async function rateLimitedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Wait for rate limit slot
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_INTERVAL_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_INTERVAL_MS - timeSinceLastRequest)
    );
  }

  // Wait for concurrent slot
  while (activeRequests >= MAX_CONCURRENT) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  activeRequests++;
  lastRequestTime = Date.now();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") || "60");
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      activeRequests--;
      return rateLimitedFetch(endpoint, options);
    }

    return response;
  } finally {
    activeRequests--;
  }
}

async function apiGet(endpoint: string): Promise<any> {
  const response = await rateLimitedFetch(endpoint);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function apiPost(endpoint: string, body: any): Promise<any> {
  const response = await rateLimitedFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} ${text}`);
  }
  return response.json();
}

async function apiPatch(endpoint: string, body: any): Promise<any> {
  const response = await rateLimitedFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} ${text}`);
  }
  return response.json();
}

async function apiDelete(endpoint: string): Promise<any> {
  const response = await rateLimitedFetch(endpoint, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  // DELETE may return empty body
  const text = await response.text();
  return text ? JSON.parse(text) : { success: true };
}

// ============================================================================
// Tool Definitions
// ============================================================================

const tools: Tool[] = [
  {
    name: "missive_contacts",
    description:
      "Manage Missive contacts, contact books, and contact groups. Actions: list, get, create, update, list_books, list_groups",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "create", "update", "list_books", "list_groups"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Contact ID (required for get, update)",
        },
        contact: {
          type: "object",
          description: "Contact data for create/update",
          properties: {
            email: { type: "string" },
            phone_number: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            company: { type: "string" },
            contact_book: { type: "string", description: "Contact book ID" },
          },
        },
        contacts: {
          type: "array",
          description: "Array of contacts for bulk create",
          items: { type: "object" },
        },
        limit: {
          type: "number",
          description: "Max results to return (default 50)",
        },
        offset: {
          type: "number",
          description: "Offset for pagination",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_conversations",
    description:
      "List and get Missive conversations, including their messages and comments. Actions: list, get, messages, comments",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "messages", "comments"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Conversation ID (required for get, messages, comments)",
        },
        mailbox: {
          type: "string",
          description: "Filter by mailbox ID",
        },
        shared_label: {
          type: "string",
          description: "Filter by shared label ID",
        },
        team: {
          type: "string",
          description: "Filter by team ID",
        },
        assignee: {
          type: "string",
          description: "Filter by assignee user ID",
        },
        closed: {
          type: "boolean",
          description: "Filter by closed status",
        },
        inbox: {
          type: "boolean",
          description: "If true, return inbox conversations (open items across all mailboxes)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 50)",
        },
        offset: {
          type: "number",
          description: "Offset for pagination",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_drafts",
    description:
      "Create, send, and delete email drafts. Actions: create, send, delete",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "send", "delete"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Draft ID (required for delete)",
        },
        draft: {
          type: "object",
          description: "Draft data for create/send",
          properties: {
            subject: { type: "string" },
            body: { type: "string", description: "HTML body content" },
            to_fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
            cc_fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
            bcc_fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  address: { type: "string" },
                  name: { type: "string" },
                },
              },
            },
            from_field: {
              type: "object",
              properties: {
                address: { type: "string" },
                name: { type: "string" },
              },
            },
            conversation: {
              type: "string",
              description: "Conversation ID to add draft to (for replies)",
            },
            organization: {
              type: "string",
              description: "Organization ID",
            },
          },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_messages",
    description:
      "Create and retrieve messages. Actions: create, get, find_by_email_id",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "get", "find_by_email_id"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Message ID (required for get)",
        },
        email_message_id: {
          type: "string",
          description: "Email Message-ID header (for find_by_email_id)",
        },
        message: {
          type: "object",
          description: "Message data for create",
          properties: {
            conversation: { type: "string", description: "Conversation ID" },
            notification: {
              type: "object",
              properties: {
                title: { type: "string" },
                body: { type: "string" },
              },
            },
            add_shared_labels: {
              type: "array",
              items: { type: "string" },
            },
            add_assignees: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_teams",
    description: "List, create, and update teams. Actions: list, create, update",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Team ID (required for update)",
        },
        team: {
          type: "object",
          description: "Team data for create/update",
          properties: {
            name: { type: "string" },
            organization: { type: "string", description: "Organization ID" },
          },
        },
        teams: {
          type: "array",
          description: "Array of teams for bulk create",
          items: { type: "object" },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_users",
    description: "List users in your organization. Actions: list",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list"],
          description: "The action to perform",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_organizations",
    description: "List organizations. Actions: list",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list"],
          description: "The action to perform",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_labels",
    description:
      "Manage shared labels. Actions: list, create, update",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "create", "update"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Label ID (required for update)",
        },
        label: {
          type: "object",
          description: "Label data for create/update",
          properties: {
            name: { type: "string" },
            color: { type: "string" },
            organization: { type: "string", description: "Organization ID" },
            parent: { type: "string", description: "Parent label ID" },
          },
        },
        labels: {
          type: "array",
          description: "Array of labels for bulk create",
          items: { type: "object" },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_tasks",
    description: "Create and update tasks. Actions: create, update",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "update"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Task ID (required for update)",
        },
        task: {
          type: "object",
          description: "Task data",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            conversation: { type: "string", description: "Conversation ID" },
            assignee: { type: "string", description: "User ID" },
            due_at: { type: "string", description: "ISO 8601 timestamp" },
            completed: { type: "boolean" },
          },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_responses",
    description:
      "Manage canned responses. Actions: list, get, create, update, delete",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["list", "get", "create", "update", "delete"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Response ID (required for get, update, delete)",
        },
        response: {
          type: "object",
          description: "Response data for create/update",
          properties: {
            name: { type: "string" },
            subject: { type: "string" },
            body: { type: "string" },
            organization: { type: "string", description: "Organization ID" },
          },
        },
        responses: {
          type: "array",
          description: "Array of responses for bulk create",
          items: { type: "object" },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_analytics",
    description:
      "Create and retrieve analytics reports. Actions: create_report, get_report",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create_report", "get_report"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Report ID (required for get_report)",
        },
        report: {
          type: "object",
          description: "Report configuration for create_report",
          properties: {
            organization: { type: "string", description: "Organization ID" },
            start_date: { type: "string", description: "ISO 8601 date" },
            end_date: { type: "string", description: "ISO 8601 date" },
            metrics: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_webhooks",
    description: "Create and delete webhooks. Actions: create, delete",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "delete"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Webhook ID (required for delete)",
        },
        webhook: {
          type: "object",
          description: "Webhook configuration for create",
          properties: {
            url: { type: "string" },
            events: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      required: ["action"],
    },
  },
  {
    name: "missive_posts",
    description:
      "Create and delete posts (internal messages in conversations). Actions: create, delete",
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["create", "delete"],
          description: "The action to perform",
        },
        id: {
          type: "string",
          description: "Post ID (required for delete)",
        },
        post: {
          type: "object",
          description: "Post data for create",
          properties: {
            conversation: { type: "string", description: "Conversation ID" },
            notification: {
              type: "object",
              properties: {
                title: { type: "string" },
                body: { type: "string" },
              },
            },
            text: { type: "string" },
            markdown: { type: "string" },
          },
        },
      },
      required: ["action"],
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

async function handleContacts(args: any): Promise<any> {
  const { action, id, contact, contacts, limit = 50, offset = 0 } = args;

  switch (action) {
    case "list":
      return apiGet(`/contacts?limit=${limit}&offset=${offset}`);
    case "get":
      if (!id) throw new Error("id is required for get action");
      return apiGet(`/contacts/${id}`);
    case "create":
      if (contacts) {
        return apiPost("/contacts", { contacts });
      }
      if (contact) {
        return apiPost("/contacts", { contacts: contact });
      }
      throw new Error("contact or contacts is required for create action");
    case "update":
      if (!id) throw new Error("id is required for update action");
      if (!contact) throw new Error("contact is required for update action");
      return apiPatch(`/contacts/${id}`, { contacts: contact });
    case "list_books":
      return apiGet("/contact_books");
    case "list_groups":
      return apiGet("/contact_groups");
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleConversations(args: any): Promise<any> {
  const {
    action,
    id,
    mailbox,
    shared_label,
    team,
    assignee,
    closed,
    inbox,
    limit = 50,
    offset = 0,
  } = args;

  switch (action) {
    case "list": {
      const params = new URLSearchParams();
      params.append("limit", String(limit));
      params.append("offset", String(offset));
      if (inbox) params.append("inbox", "true");
      if (mailbox) params.append("mailbox", mailbox);
      if (shared_label) params.append("shared_label", shared_label);
      if (team) params.append("team", team);
      if (assignee) params.append("assignee", assignee);
      if (closed !== undefined) params.append("closed", String(closed));
      return apiGet(`/conversations?${params.toString()}`);
    }
    case "get":
      if (!id) throw new Error("id is required for get action");
      return apiGet(`/conversations/${id}`);
    case "messages":
      if (!id) throw new Error("id is required for messages action");
      return apiGet(`/conversations/${id}/messages`);
    case "comments":
      if (!id) throw new Error("id is required for comments action");
      return apiGet(`/conversations/${id}/comments`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleDrafts(args: any): Promise<any> {
  const { action, id, draft } = args;

  switch (action) {
    case "create":
      if (!draft) throw new Error("draft is required for create action");
      return apiPost("/drafts", { drafts: draft });
    case "send":
      if (!draft) throw new Error("draft is required for send action");
      return apiPost("/drafts", { drafts: { ...draft, send: true } });
    case "delete":
      if (!id) throw new Error("id is required for delete action");
      return apiDelete(`/drafts/${id}`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleMessages(args: any): Promise<any> {
  const { action, id, email_message_id, message } = args;

  switch (action) {
    case "create":
      if (!message) throw new Error("message is required for create action");
      return apiPost("/messages", { messages: message });
    case "get":
      if (!id) throw new Error("id is required for get action");
      return apiGet(`/messages/${id}`);
    case "find_by_email_id":
      if (!email_message_id)
        throw new Error("email_message_id is required for find_by_email_id");
      return apiGet(
        `/messages?email_message_id=${encodeURIComponent(email_message_id)}`
      );
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleTeams(args: any): Promise<any> {
  const { action, id, team, teams } = args;

  switch (action) {
    case "list":
      return apiGet("/teams");
    case "create":
      if (teams) {
        return apiPost("/teams", { teams });
      }
      if (team) {
        return apiPost("/teams", { teams: team });
      }
      throw new Error("team or teams is required for create action");
    case "update":
      if (!id) throw new Error("id is required for update action");
      if (!team) throw new Error("team is required for update action");
      return apiPatch(`/teams/${id}`, { teams: team });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleUsers(args: any): Promise<any> {
  const { action } = args;

  switch (action) {
    case "list":
      return apiGet("/users");
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleOrganizations(args: any): Promise<any> {
  const { action } = args;

  switch (action) {
    case "list":
      return apiGet("/organizations");
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleLabels(args: any): Promise<any> {
  const { action, id, label, labels } = args;

  switch (action) {
    case "list":
      return apiGet("/shared_labels");
    case "create":
      if (labels) {
        return apiPost("/shared_labels", { shared_labels: labels });
      }
      if (label) {
        return apiPost("/shared_labels", { shared_labels: label });
      }
      throw new Error("label or labels is required for create action");
    case "update":
      if (!id) throw new Error("id is required for update action");
      if (!label) throw new Error("label is required for update action");
      return apiPatch(`/shared_labels/${id}`, { shared_labels: label });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleTasks(args: any): Promise<any> {
  const { action, id, task } = args;

  switch (action) {
    case "create":
      if (!task) throw new Error("task is required for create action");
      return apiPost("/tasks", { tasks: task });
    case "update":
      if (!id) throw new Error("id is required for update action");
      if (!task) throw new Error("task is required for update action");
      return apiPatch(`/tasks/${id}`, { tasks: task });
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleResponses(args: any): Promise<any> {
  const { action, id, response, responses } = args;

  switch (action) {
    case "list":
      return apiGet("/responses");
    case "get":
      if (!id) throw new Error("id is required for get action");
      return apiGet(`/responses/${id}`);
    case "create":
      if (responses) {
        return apiPost("/responses", { responses });
      }
      if (response) {
        return apiPost("/responses", { responses: response });
      }
      throw new Error("response or responses is required for create action");
    case "update":
      if (!id) throw new Error("id is required for update action");
      if (!response) throw new Error("response is required for update action");
      return apiPatch(`/responses/${id}`, { responses: response });
    case "delete":
      if (!id) throw new Error("id is required for delete action");
      return apiDelete(`/responses/${id}`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleAnalytics(args: any): Promise<any> {
  const { action, id, report } = args;

  switch (action) {
    case "create_report":
      if (!report) throw new Error("report is required for create_report");
      return apiPost("/analytics/reports", report);
    case "get_report":
      if (!id) throw new Error("id is required for get_report");
      return apiGet(`/analytics/reports/${id}`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handleWebhooks(args: any): Promise<any> {
  const { action, id, webhook } = args;

  switch (action) {
    case "create":
      if (!webhook) throw new Error("webhook is required for create action");
      return apiPost("/hooks", webhook);
    case "delete":
      if (!id) throw new Error("id is required for delete action");
      return apiDelete(`/hooks/${id}`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function handlePosts(args: any): Promise<any> {
  const { action, id, post } = args;

  switch (action) {
    case "create":
      if (!post) throw new Error("post is required for create action");
      return apiPost("/posts", { posts: post });
    case "delete":
      if (!id) throw new Error("id is required for delete action");
      return apiDelete(`/posts/${id}`);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ============================================================================
// Server Setup
// ============================================================================

const server = new Server(
  {
    name: "missive",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: any;

    switch (name) {
      case "missive_contacts":
        result = await handleContacts(args);
        break;
      case "missive_conversations":
        result = await handleConversations(args);
        break;
      case "missive_drafts":
        result = await handleDrafts(args);
        break;
      case "missive_messages":
        result = await handleMessages(args);
        break;
      case "missive_teams":
        result = await handleTeams(args);
        break;
      case "missive_users":
        result = await handleUsers(args);
        break;
      case "missive_organizations":
        result = await handleOrganizations(args);
        break;
      case "missive_labels":
        result = await handleLabels(args);
        break;
      case "missive_tasks":
        result = await handleTasks(args);
        break;
      case "missive_responses":
        result = await handleResponses(args);
        break;
      case "missive_analytics":
        result = await handleAnalytics(args);
        break;
      case "missive_webhooks":
        result = await handleWebhooks(args);
        break;
      case "missive_posts":
        result = await handlePosts(args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Missive MCP server running on stdio");
}

main().catch(console.error);
