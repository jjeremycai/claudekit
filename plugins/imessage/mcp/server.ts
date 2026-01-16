import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync, spawn } from "child_process";

const server = new McpServer({
  name: "imessage",
  version: "0.1.0",
});

// Helper to run imsg commands
function imsg(args: string[]): string {
  try {
    return execSync(`imsg ${args.join(" ")}`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (err: any) {
    throw new Error(`imsg error: ${err.stderr || err.message}`);
  }
}

// List recent chats
server.tool(
  "list_chats",
  "List recent iMessage chats with their IDs and last message time",
  {
    limit: z.number().optional().describe("Max chats to return (default 20)"),
  },
  async ({ limit }) => {
    const result = imsg(["chats", "--limit", String(limit || 20)]);
    return { content: [{ type: "text", text: result }] };
  }
);

// Get messages from a chat
server.tool(
  "get_messages",
  "Get recent messages from a specific chat by chat ID",
  {
    chat_id: z.string().describe("Chat ID (number in brackets from list_chats)"),
    limit: z.number().optional().describe("Max messages to return (default 50)"),
  },
  async ({ chat_id, limit }) => {
    const result = imsg(["messages", chat_id, "--limit", String(limit || 50)]);
    return { content: [{ type: "text", text: result }] };
  }
);

// Search messages
server.tool(
  "search_messages",
  "Search iMessage history for text",
  {
    query: z.string().describe("Text to search for"),
    limit: z.number().optional().describe("Max results (default 50)"),
  },
  async ({ query, limit }) => {
    const result = imsg(["search", `"${query}"`, "--limit", String(limit || 50)]);
    return { content: [{ type: "text", text: result }] };
  }
);

// Get chat info
server.tool(
  "get_chat_info",
  "Get details about a specific chat",
  {
    chat_id: z.string().describe("Chat ID"),
  },
  async ({ chat_id }) => {
    const result = imsg(["chat", chat_id]);
    return { content: [{ type: "text", text: result }] };
  }
);

// Send a message
server.tool(
  "send_message",
  "Send an iMessage to a phone number, email, or chat ID",
  {
    to: z.string().describe("Phone number, email, or chat ID to send to"),
    text: z.string().describe("Message text to send"),
  },
  async ({ to, text }) => {
    // Use spawn for sending to properly escape the message
    return new Promise((resolve, reject) => {
      const child = spawn("imsg", ["send", to, text]);
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => (stdout += data));
      child.stderr.on("data", (data) => (stderr += data));

      child.on("close", (code) => {
        if (code === 0) {
          resolve({
            content: [{ type: "text", text: stdout || `Message sent to ${to}` }],
          });
        } else {
          reject(new Error(`Failed to send: ${stderr}`));
        }
      });
    });
  }
);

// Get recent messages across all chats
server.tool(
  "recent_messages",
  "Get the most recent messages across all chats",
  {
    limit: z.number().optional().describe("Max messages (default 30)"),
  },
  async ({ limit }) => {
    const result = imsg(["recent", "--limit", String(limit || 30)]);
    return { content: [{ type: "text", text: result }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
