# PLAN STATE (Generated)

Last updated: 2026-07-15

## Focus

Current focus is the distillation + memory-query POC (3–7 day timebox): auto-distill Koa chat messages into indexed thoughts, then keyword-based querying — targeting a usable infinite-memory loop for the V1 marketing push. Both master plans are approved; Phase 1 schema work has begun; tool loop bugs are fixed.

## Plan linkage

- Distillation master plan (approved, next up):
  - `.context/_generated/plans/thought-distillation-poc.md`

- Memory query master plan (approved, follows/overlaps distillation):
  - `.context/_generated/plans/memory-query-poc.md`

- Primary vertical scaffold:
  - `.context/_generated/plans/imessage-server-poc.md`

- Preview promotion and stable domain strategy (api-experimental MVP):
  - `.context/_generated/plans/vercel-preview-promotion-api-experimental.md`

- Detailed adapter/history resolution:
  - `.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md`

- Architecture constraints:
  - `.context/_generated/plans/monorepo-architecture.md`

- Human pacing / multi-bubble roadmap (not MVP timing engine):
  - `.context/_generated/plans/imessage-human-timing-emulation.md`

## Confirmed status

- Adapter fork baseline and DM routing for direct messages: **completed**.

- Drizzle CLI integration in `@altered/server-experimental`:
  - `drizzle.config.ts` with repo-root `.env` load and required `SHARED_STORAGE_DATABASE_URL`.
  - Scripts: `push:db`, `view:db` (+ root aliases `db:push`, `db:studio`).
  - Package-level `turbo.json` env wiring for DB tasks.
  - `pnpm check`: **passing**.

- Owned history data-access layer:
  - Conversation resolution by thread id via `external_resources`.
  - Reset/new conversation flow by re-pointing active thread anchor.
  - Message save/list helpers and message-to-model transform.

- Memory-backed AI response loop:
  - Persist inbound user message.
  - Load conversation history from Postgres.
  - Generate assistant reply from model messages.
  - Persist assistant reply.
  - Status: **working in manual verification**.

- Command trigger behavior:
  - `/reset`, `/new`, `/clear` behavior corrected in latest iteration.

## Repository layout (this slice)

- **Environment/config:** `packages/core-experimental/src/config/environment.ts` (includes **`shared.identity.adminPhoneNumber`** from **`SHARED_ADMIN_PHONE_NUMBER`**, defaults to **`""`** when unset to disable gated behavior).

- **AI generation:** `packages/server-experimental/src/ai/generate/response-from-model-messages.ts`.

- **Chat persistence helpers:**
  - `packages/server-experimental/src/chat/conversations/get-or-create-active-for-thread.ts`
  - `packages/server-experimental/src/chat/conversations/start-new-for-thread.ts`
  - `packages/server-experimental/src/chat/messages/save.ts`
  - `packages/server-experimental/src/chat/messages/list-for-conversation.ts`
  - `packages/server-experimental/src/chat/messages/to-model-messages.ts`

- **iMessage direct-message flow:**
  - `packages/server-experimental/src/chat/providers/imessage/events/direct-message/handler.ts`
  - `packages/server-experimental/src/chat/providers/imessage/events/direct-message/build-response.ts`
  - `packages/server-experimental/src/chat/providers/imessage/events/direct-message/is-command-trigger.ts`

- **Database schema wiring:**
  - `packages/server-experimental/src/storage/database/schema.ts` now exports `{ conversations, chatMessages, externalResources }`.
  - `packages/server-experimental/src/storage/database/relations.ts` aligned to `chatMessages`.
  - `packages/server-experimental/src/storage/database/external-resources/*` includes `thread` type and provider-aware id resolution.

## Completion map (high-level)

- Owned Postgres history schema + relations + data access: **completed for POC scope**.

- Memory-backed direct-message response path: **completed for POC scope**.

- Message-id dedupe for replay/webhook duplicates: **queued (not started)**.

- Production-to-dev rerouting from one webhook endpoint: **next planned work**.

- Preview deployment promotion pipeline (api-experimental):
  - Plan captured; Phase 0 passed.
  - Initial implementation landed in `@altered/tooling`:
    - `altered-preview-promote` CLI (manual commit/branch/current-branch promotion path).
    - Vercel SDK-based deployment create + ready-state polling + domain alias assignment for `api-experimental`.
    - Root command: `pnpm preview:promote:api-experimental --commit <commit-sha>` or `--branch <branch-name>`, with no args defaulting to the current non-`main` branch.
    - CLI verifies commit/branch sync with origin before calling Vercel.
    - CLI hardening: branch-name validation, local branch existence checks, detached-HEAD guard, and authenticated GitHub commit existence checks via `SHARED_PROVIDER_GITHUB_SECRET`.
  - Workflow automation consolidated into one pipeline:
    - `.github/workflows/ci.yml`
  - `Manage Deployments / Deploy & Promote Preview` now waits on `Code Quality / Check Types` and `Code Quality / Lint & Format`.
  - Shared GitHub Actions setup logic extracted into:
    - `.github/actions/setup-ci/action.yml`
  - Deploy/promote preview routes through `pnpm preview:promote` (`--all-apps`) with workflow-dispatch support (`branch`, `commit`) and push branch promotion via explicit `github.ref_name`.
  - Workflow still needs first live run verification.

- Admin webhook forwarding preference and control path:
  - Redis-backed persisted forwarding target added for admin phone numbers: `preview-development` or implicit `none` (missing key).
  - Admin command detection moved to an ephemeral natural-language flow powered by lightweight model classification (`openai/gpt-5.4-nano` via OpenRouter) with high-confidence gating.
  - Added a mock AI SDK tool-calling path (`orderCoffee`) for admin-only immediate-task testing, with optional `type` input and ephemeral confirmation response.
  - Preference updates respond directly over iMessage and skip DB history persistence for both command messages and confirmations.
  - Forwarded webhook metadata now includes explicit target header (`x-altered-forwarded-target`) in addition to forwarded marker.
  - Failure mode hardened: if KV read/write or forwarding fails, ingress still returns provider-facing `200 OK`; production ingestion remains bypassed during active forwarding attempts.

- Preview deployment management direction (2026-05-24):
  - Build minimal MVP for `api-experimental` first, while shaping code for multi-app extension.
  - Use a stable preview domain target per app with auto-promote on non-main pushes and manual commit re-promote support.
  - Keep Vercel branch auto previews disabled; deploy manually through GitHub Actions + TypeScript scripts.
  - Keep webhook ingress behavior as `200 OK` to provider while handling forwarding failures internally.

- Effect conversion/retries/hardening pass: **deferred until post-POC stabilization**.

## Current risks and caveats

- Dedupe is not implemented yet; duplicate provider deliveries can still create repeated message rows/replies.

- Natural-language admin command routing currently only handles webhook forwarding target changes; `/new` conversation resets still use slash triggers.

- Keep Chat SDK thread iterators out of LLM truth path; Postgres remains canonical for context.

## Next execution order

1. Distillation POC per `thought-distillation-poc.md`: complete schema/models (thoughts, datasets, and their join table complete) → chunker + context tools → distillation subagent in `scripts/tmp-distill-poc.ts` → keyword job → save-path integration (message-persistence stripping refactor + on-save trigger) → reindex script → Apple Notes upload utility.

2. Memory query POC per `memory-query-poc.md`: retrieval SQL + exclusion window (simple 512-token v1) → keyword inference (shared codepath) → relevance pass → replace `query-memory` placeholder → E2E.

3. After both are tested to satisfaction: structured-thinking prototype (datasets layered on refined thoughts, likely Raycast interface).

4. Previously queued (still pending, deprioritized): admin command surface expansion, provider message-id dedupe, multi-bubble send pipeline, Effect migration evaluation.
