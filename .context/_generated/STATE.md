# PLAN STATE (Generated)

Last updated: 2026-04-28

## Focus

Current focus is the iMessage POC path with Sendblue + Chat SDK integration, moving into owned Postgres history, then AI bridge and memory-backed replies.

## Plan linkage

- Primary vertical scaffold:
  - `.context/_generated/plans/imessage-server-poc.md`

- Detailed adapter/history resolution:
  - `.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md`

- Architecture constraints:
  - `.context/_generated/plans/monorepo-architecture.md`

## Confirmed status

- Adapter fork and API-surface alignment: **completed (current phase)**.

- DM routing enablement for iMessage 1:1: **completed (current phase)**.

- Known upstream Chat SDK quirk around DM mention/subscription semantics:
  - `vercel/chat` issue `#432`.

## Repository layout (this slice)

- **Environment / config:** `packages/core-experimental/src/config/environment.ts` — `getEnvironmentConfig()` (singleton via `??=`) validates shared **database URL**, **KV URL**, and Sendblue provider secrets from env.

- **Chat singleton:** `packages/server-experimental/src/chat/instance.ts` — `getAlteredChat()` (or equivalent) for the Chat SDK instance.

- **Provider constants:** `packages/server-experimental/src/chat/providers/definitions.ts` — opaque **provider ids** and metadata for conversations and cross-cutting use.

- **Drizzle:** `packages/server-experimental/src/storage/database/`
  - `connection.ts` — `getDatabase()` uses `getEnvironmentConfig()` and `drizzle({ connection: { connectionString }, schema, relations, casing: "snake_case" })`.
  - `schema.ts` — exports a **`schema` object** `{ conversations, messages, externalResources }` passed into `defineRelations` and `drizzle`.
  - `relations.ts` — `defineRelations(schema, …)`.
  - `external-resources/schema.ts` — **`external_resources`** polymorphic link table (`conversation_id` XOR `message_id` via `CHECK`), **`resource_type_id`** + **`reference_id`**, partial uniques per parent + type, global unique on `(resource_type_id, reference_id)`.
  - `external-resources/definitions.ts` — in-code **resource type** registry (ids, keys, names, owning `providerId`).

- **Chat tables:** `packages/server-experimental/src/chat/conversations/schema.ts`, `…/messages/schema.ts` — `chat_conversations` (includes **`provider_id`**), `chat_messages` (**`parts` not null**, **`attachments` nullable**, `brain_id`, timestamptz).

- **iMessage provider implementation:** `packages/server-experimental/src/chat/providers/imessage/**` (webhook, events, behaviors).

## Completion map (high-level)

- Owned Postgres history schema (tables + relations + DB client wiring): **in progress** (structure landed; **persistence helpers + handler writes** not started).

- AI history bridge and memory-backed generation: **not started**.

## Next execution order

1. Add small **repository / insert helpers** (conversation upsert, message insert, external resource upsert) using `getDatabase()`.

2. Wire **iMessage handlers** to persist inbound/outbound rows and link **Sendblue** / **Chat SDK** ids via `external_resources`.

3. Build a minimal **AI SDK v6 / LMS V3** message bridge from stored rows.

4. Wire first **memory-backed** reply loop.

## Risks and caveats to remember

- Upstream Chat SDK routing behavior can make DM mention/subscription semantics odd in edge flows.

- Do not use Chat SDK thread iterators as **source of truth** for LLM context; use owned rows.

- Keep read receipt behavior explicit at the app layer.

## Working assumptions

- Drizzle remains inside `@altered/server-experimental` for this phase.

- Redis remains Chat SDK state backend for this phase.

- Owned Postgres tables are the canonical memory/history source for AI context.

- Implementation stays in small, reviewable chunks with separate commits.
