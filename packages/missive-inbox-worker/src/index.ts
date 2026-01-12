import Anthropic from "@anthropic-ai/sdk";

interface Env {
	MISSIVE_API_TOKEN: string;
	ANTHROPIC_API_KEY: string;
}

interface MissiveConversation {
	id: string;
	latest_message_subject: string;
	drafts_count: number;
	messages_count: number;
	organization?: { id: string; name: string };
	authors: Array<{ name: string; address: string }>;
	external_authors: Array<{ name: string; address: string }>;
}

interface MissiveMessage {
	id: string;
	type: string;
	body?: string;
	preview?: string;
	from_field?: { name: string; address: string };
	to_fields?: Array<{ name: string; address: string }>;
	delivered_at: number;
	subject?: string;
}

// Patterns to skip
const SKIP_PATTERNS = {
	senders: [
		"notifications@ashbyhq.com",
		"noreply@",
		"no-reply@",
		"donotreply@",
		"notifications@",
		"alert@",
		"alerts@",
		"newsletter@",
		"marketing@",
	],
	subjects: [
		"[Ashby]",
		"Your receipt",
		"Order confirmation",
		"Shipping notification",
		"Password reset",
		"Verify your email",
		"unsubscribe",
	],
};

function shouldSkipConversation(conv: MissiveConversation): boolean {
	// Already has a draft
	if (conv.drafts_count > 0) return true;

	// Check sender patterns
	const senderAddress = conv.external_authors[0]?.address?.toLowerCase() || "";
	for (const pattern of SKIP_PATTERNS.senders) {
		if (senderAddress.includes(pattern.toLowerCase())) return true;
	}

	// Check subject patterns
	const subject = conv.latest_message_subject?.toLowerCase() || "";
	for (const pattern of SKIP_PATTERNS.subjects) {
		if (subject.includes(pattern.toLowerCase())) return true;
	}

	return false;
}

async function fetchMissiveInbox(token: string): Promise<MissiveConversation[]> {
	const response = await fetch(
		"https://public.missiveapp.com/v1/conversations?inbox=true&limit=50",
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Missive API error: ${response.status} - ${text}`);
	}

	const data = (await response.json()) as { conversations: MissiveConversation[] };
	return data.conversations;
}

async function fetchConversationMessages(
	token: string,
	conversationId: string
): Promise<MissiveMessage[]> {
	const response = await fetch(
		`https://public.missiveapp.com/v1/conversations/${conversationId}/messages`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		throw new Error(`Missive messages API error: ${response.status}`);
	}

	const data = (await response.json()) as { messages: MissiveMessage[] };
	return data.messages;
}

async function generateDraftResponse(
	anthropic: Anthropic,
	messages: MissiveMessage[],
	conversation: MissiveConversation
): Promise<string> {
	// Build context from messages
	const threadContext = messages
		.filter((m) => m.type === "email")
		.sort((a, b) => a.delivered_at - b.delivered_at)
		.map((m) => {
			const from = m.from_field?.name || m.from_field?.address || "Unknown";
			const preview = m.preview || m.body?.slice(0, 500) || "";
			return `From: ${from}\n${preview}`;
		})
		.join("\n---\n");

	const prompt = `You are drafting an email reply for Jeremy Cai.

Context: This is a ${conversation.latest_message_subject?.includes("Shaw") || conversation.latest_message_subject?.includes("Software Engineer") ? "recruiting/candidate" : "professional"} email thread.

Thread:
${threadContext}

Draft a brief, professional reply (2-4 sentences) to the most recent message. Be friendly but concise. Sign off with just "Jeremy" (no last name, no title).

Reply only with the email body text, no subject line or headers.`;

	const response = await anthropic.messages.create({
		model: "claude-sonnet-4-20250514",
		max_tokens: 500,
		messages: [{ role: "user", content: prompt }],
	});

	const textBlock = response.content.find((block) => block.type === "text");
	return textBlock?.text || "";
}

function formatDraftBody(draftText: string, originalMessage: MissiveMessage): string {
	const date = new Date(originalMessage.delivered_at * 1000).toLocaleDateString("en-US", {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
	const sender = originalMessage.from_field?.name || originalMessage.from_field?.address || "Unknown";
	const originalBody = originalMessage.body || originalMessage.preview || "";

	// Format with proper spacing and quoted content
	return `${draftText.replace(/\n/g, "<br>")}<br><br>

<div>On ${date}, ${sender} wrote:</div>
<blockquote style="margin:0 0 0 0.5em;padding:0 0 0 0.5em;border-left:2px solid #ccc">
${originalBody}
</blockquote>`;
}

async function createDraft(
	token: string,
	conversationId: string,
	organizationId: string | undefined,
	body: string,
	toFields: Array<{ name?: string; address: string }>,
	fromAddress: string
): Promise<void> {
	const draft: Record<string, unknown> = {
		body,
		conversation: conversationId,
		to_fields: toFields,
		from_field: { address: fromAddress },
	};

	if (organizationId) {
		draft.organization = organizationId;
	}

	const response = await fetch("https://public.missiveapp.com/v1/drafts", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ drafts: draft }),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to create draft: ${response.status} - ${error}`);
	}
}

async function processInbox(
	env: Env
): Promise<{ processed: number; drafted: number; skipped: number; errors: string[] }> {
	const errors: string[] = [];
	let processed = 0;
	let drafted = 0;
	let skipped = 0;

	try {
		const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
		const conversations = await fetchMissiveInbox(env.MISSIVE_API_TOKEN);

		for (const conv of conversations) {
			processed++;

			if (shouldSkipConversation(conv)) {
				skipped++;
				continue;
			}

			try {
				const messages = await fetchConversationMessages(env.MISSIVE_API_TOKEN, conv.id);

				// Check if last message is from user (already replied)
				const emailMessages = messages.filter((m) => m.type === "email");
				const latestEmail = emailMessages.sort((a, b) => b.delivered_at - a.delivered_at)[0];

				if (!latestEmail) {
					skipped++;
					continue;
				}

				const isFromUser =
					latestEmail.from_field?.address?.includes("jeremy@italic.com") ||
					latestEmail.from_field?.address?.includes("j@kirin.com") ||
					latestEmail.from_field?.address?.includes("jjeremycai@gmail.com");

				if (isFromUser) {
					skipped++;
					continue;
				}

				// Generate draft
				const draftText = await generateDraftResponse(anthropic, messages, conv);
				if (!draftText) {
					errors.push(`Empty draft for ${conv.id}`);
					continue;
				}

				// Format with quoted content
				const formattedBody = formatDraftBody(draftText, latestEmail);

				// Determine from address (reply from address it was sent to)
				const toAddress = latestEmail.to_fields?.[0]?.address || "jeremy@italic.com";
				const fromAddress = toAddress.includes("italic.com")
					? "jeremy@italic.com"
					: toAddress.includes("kirin.com")
						? "j@kirin.com"
						: "jjeremycai@gmail.com";

				// Create draft
				await createDraft(
					env.MISSIVE_API_TOKEN,
					conv.id,
					conv.organization?.id,
					formattedBody,
					conv.external_authors.map((a) => ({ name: a.name, address: a.address })),
					fromAddress
				);

				drafted++;
				console.log(`Created draft for: ${conv.latest_message_subject}`);
			} catch (e) {
				errors.push(`Error processing ${conv.id}: ${e}`);
			}
		}
	} catch (e) {
		errors.push(`Fatal error: ${e}`);
	}

	console.log(`Processed: ${processed}, Drafted: ${drafted}, Skipped: ${skipped}`);
	return { processed, drafted, skipped, errors };
}

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		// Allow manual trigger via HTTP for testing
		const url = new URL(req.url);
		if (url.pathname === "/run" || url.searchParams.has("cron")) {
			const result = await processInbox(env);
			return new Response(JSON.stringify(result, null, 2), {
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response("Missive Inbox Worker. Visit /run to trigger manually.", {
			status: 200,
		});
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(processInbox(env));
	},
};
