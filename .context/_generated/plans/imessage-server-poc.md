---
name: api Sendblue vertical
overview: "First API vertical on the experimental channel per monorepo-architecture: `@altered/server-experimental`, `@altered/api-experimental`, `apps/api-experimental`. Sendblue webhook, BA sendblue plugin (no session), Redis Chat state, Drizzle app tables, Effect+AI SDK, computed origins (api.usealtered.com vs apex)."
todos:
  - id: catalog-workspace
    content: "pnpm catalog: deps for server-experimental, api-experimental (package), altered-api-experimental (app), tooling/ngrok"
    status: pending
  - id: pkg-server-experimental
    content: "@altered/server-experimental: auth+sendblue plugin, Drizzle app schema+Effect pg, mergeSchema for BA"
    status: pending
  - id: pkg-api-experimental
    content: "@altered/api-experimental: compose Hono app from server-experimental (thin merge layer)"
    status: pending
  - id: app-api-experimental
    content: "apps/api-experimental: Vercel shell, imports @altered/api-experimental only, vercel.json, .env"
    status: pending
  - id: config-origins-effect
    content: "Effect Config: ROUTING_* / ORIGIN_API, NODE_ENV|VERCEL_ENV derivation, webhook URL = origin + /webhooks/sendblue"
    status: pending
  - id: turbo-ngrok-dev
    content: tooling/ngrok dev + turbo; PROVIDER_NGROK_URL = public API origin in dev (must match tunnel host)
    status: pending
  - id: chat-redis-webhook
    content: Chat+Sendblue+state-redis, waitUntil, read receipt after ack
    status: pending
  - id: ai-effect-wrap
    content: AI SDK in Effect; OpenRouter; default model in Config
    status: pending
  - id: better-auth-sendblue-plugin
    content: "sendblue plugin: verify+signing, manual user/account, merge policy; BA baseURL allowedHosts *.usealtered.com + vercel + tunnel; crossSubDomainCookies when web+api share cookies"
    status: pending
  - id: llm-history-context
    content: Full thread history from Drizzle into AI SDK messages
    status: pending
  - id: root-wireup
    content: Root turbo/scripts, db:push, Biome matrix per arch when packages exist
    status: pending
isProject: false
---

# API vertical: Sendblue + Better Auth + Effect

**Canonical monorepo rules:** `[.context/_generated/plans/monorepo-architecture.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/monorepo-architecture.md)` — thin apps, fat packages, import matrix, no deployable app importing `server-internal-*` directly (composition lives in `@altered/api-experimental`). **This plan does not duplicate that doc;** naming and layering below must match it.

**Sendblue adapter fork, owned Drizzle history, explicit read receipts, DM routing, AI bridge:** when executing webhook work, handler routing, Postgres message tables, or AI context wiring for this vertical, **read and follow** `[.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md)` first. That document is the **detailed** source of truth for those concerns; **this POC plan does not duplicate it**—only stay aligned with scope and package layout here.

**Scope lock:** scaffold **experimental channel only** for this slice (`*-experimental`). Stable / pre-release packages and apps come later per the arch checklist.

## Channel and packages (first slice)


| Layer                 | Workspace                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Server implementation | `@altered/server-experimental` — Drizzle (app tables), Better Auth + **sendblue** plugin, Effect `PgClient` / Drizzle |
| Composed Hono app     | `@altered/api-experimental` — mounts routes from `server-experimental`                                               |
| Deployable shell      | `apps/api-experimental` — Vercel config, **imports `@altered/api-experimental` only**                                |


Add `@altered/server-internal-experimental` later when needed; not in v0.

## Routing and origins

- **Prod:** Web on apex `**usealtered.com`**; API at `**https://api.usealtered.com**` (separate deployable; subdomain avoids mixing cookie/CORS/Sendblue callback concerns with rewrites-only tricks).
- **Computed webhook URL:** `**${ORIGIN_API}/webhooks/sendblue**` only — no legacy `WEBHOOK_PUBLIC_URL`. `**ORIGIN_API**` = prod `https://api.usealtered.com`; dev = `**PROVIDER_NGROK_URL**` (HTTPS origin, must match the running tunnel host).
- **Effect `Config`:** one module maps env → origins; optional `VERCEL_ENV` / `NODE_ENV` for protocol or fallbacks. No `$VAR` expansion requirement.

## Better Auth: dynamic `baseURL` (multi-host)

- Follow [Better Auth dynamic base URL](https://www.better-auth.com/docs/concepts/dynamic-base-url): `**baseURL: { allowedHosts: [...], protocol?, fallback? }**` — validate `x-forwarded-host` / `host` against an allowlist.
- **Allowlist v0:** `**usealtered.com**`, `***.usealtered.com**` (wildcard may not match bare apex), `***.vercel.app**`, plus **tunnel hostname** from `**PROVIDER_NGROK_URL**`.
- `**crossSubDomainCookies`:** enable when web + API both use Better Auth cookies and should share under `**.usealtered.com**`; set explicitly per [cookies doc](https://www.better-auth.com/docs/concepts/cookies#cross-subdomain-cookies) once both apps exist.

## Data

- `**KV_URL` + `@chat-adapter/state-redis**` — Chat SDK only.
- **Postgres** — Better Auth `**user` / `session` / `account**`; **sendblue** plugin uses `**mergeSchema**` / manual rows compatible with future `**phoneNumber()**`. **Drizzle** in `**server-experimental**` for **threads**, **messages** (`user.id` FK). `**turbo db:push**` → `drizzle-kit push`.

## sendblue plugin (v0)

- `**providerId`:** `sendblue`. **Signing + verification** inside the plugin.
- `**accountId`:** `nanoid()`. Dedupe / lookup by **normalized phone** on `user` (columns aligned with [phone-number schema](https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/packages/better-auth/src/plugins/phone-number/index.ts)); **do not** enable `phoneNumber()` on this path yet — `**internalAdapter**` create/update only.
- **Webhook:** verify → resolve user → **no Better Auth session cookie**; pass `**userId**` (and `User` if needed) in Hono / Effect context.
- **Merge:** if user exists with **phone verified** → attach sendblue `account` to that user. If phone exists **unverified** on another user → **new** user for Sendblue until web verifies, then merge per future hook.
- **Bearer / JWT:** not for webhooks; see arch for future S2S. **TSDoc / `@todo` stubs** for phone, social, email link — no compat markdown file.

## Product behavior

- **AI:** Vercel AI SDK + OpenRouter, wrapped in **Effect** ([gist direction](https://gist.githubusercontent.com/juliusmarminge/f9c14a177036405f6a55332eaeb7b6f2/raw/f79a5548e19564b2a7e46b9b0452349efd76ff22/route.ts)).
- **Context:** full thread history from Drizzle → AI SDK `messages` + short iMessage system line.
- **Read receipt:** `waitUntil` immediately after webhook ack; not an LLM tool.

## Local dev

- `**tooling/ngrok`:** persistent `dev`; turbo runs **ngrok + `api-experimental` dev` in parallel.
- `PROVIDER_NGROK_URL`**:** must match the tunnel HTTPS origin used for that dev session.

## Tooling

- `**tooling/typescript`:** no `check:types` script unless you change mind. Apps/packages carry `**check:types`**.

## Open item

- **Schema drift** when enabling official **`phoneNumber()``:** one-time diff/migrate.

## Out of scope

RAG, real SMS OTP, full three-channel scaffold beyond what this slice needs, web UI.