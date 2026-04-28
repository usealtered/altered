# PLAN STATE (Generated)

Last updated: 2026-04-28

## Focus

Current focus is the iMessage POC path with Sendblue + Chat SDK integration, moving now into owned memory/history and AI integration.

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

## Completion map (high-level)

- Owned Postgres history schema and storage: **not started**.

- AI history bridge and memory-backed generation: **not started**.

## Next execution order

1. Implement owned chat history storage in `@altered/server-experimental` (Drizzle tables + write/read access functions).

2. Wire handler persistence so inbound and outbound message turns are inserted into the owned store.

3. Build a minimal bridge from owned rows to AI SDK v6/LMS v3 message format.

4. Wire first memory-backed AI response loop using owned history as context source.

## Immediate implementation target

Start with Step 1 and Step 2 together:

- Database connection/init placement in `packages/server-experimental/src/database`.

- Chat-owned tables and storage functions in feature folders under `packages/server-experimental/src/chat`.

- Keep schema minimal and forward-compatible (Nanoid ids, `external_id`, timestamps, role/content).

## Risks and caveats to remember

- Upstream Chat SDK routing behavior can make DM mention/subscription semantics odd in edge flows.

- If we accidentally rely on Chat SDK thread history iterators as source of truth, we may reintroduce platform-fetch coupling and lose control over context semantics.

- Keep read receipt behavior explicit at the app layer according to current adapter capabilities and policy.

## Working assumptions

- Drizzle remains inside `@altered/server-experimental` for this phase.

- Redis remains Chat SDK state backend for this phase.

- Owned Postgres tables are the canonical memory/history source for AI context.

- Implementation should stay in small, reviewable chunks with separate commits.
