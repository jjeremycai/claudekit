# Missive Inbox Worker

Cloudflare Worker that automatically drafts replies to emails in your Missive inbox.

## Schedule

Runs 4x/day at 9am, 12pm, 3pm, 6pm (UTC).

## What it does

1. Fetches your Missive inbox
2. Filters out automated emails (Ashby notifications, receipts, etc.)
3. Skips conversations that already have drafts
4. Skips conversations where you sent the last message
5. Uses Claude to generate draft replies
6. Creates drafts in Missive (you review and send)

## Deploy

```bash
# Login to Cloudflare
npx wrangler login

# Add secrets
npx wrangler secret put MISSIVE_API_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY

# Deploy
npm run deploy
```

## Get API tokens

- **Missive**: Settings > API tokens > Create token
- **Anthropic**: console.anthropic.com > API Keys

## Test locally

```bash
npm run dev
# Then visit http://localhost:8787/run
```

## Trigger manually

```bash
curl https://missive-inbox-worker.<your-subdomain>.workers.dev/run
```

## Customize

Edit `SKIP_PATTERNS` in `src/index.ts` to adjust which emails get skipped.
