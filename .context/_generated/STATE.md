# PLAN STATE (Generated)

Last updated: 2026-07-15

## Active session (stashed WIP)

- Cursor chat: [Raycast renderer top-down](d13781eb-7f15-47fd-9962-23c433f8e0cf)
- Transcript: `file:///Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered/agent-transcripts/d13781eb-7f15-47fd-9962-23c433f8e0cf/d13781eb-7f15-47fd-9962-23c433f8e0cf.jsonl`

We were approving changes top-down from `@altered/raycast-internal-experimental` starting at `packages/raycast-internal-experimental/src/renderer/implementation.tsx`, slowly resolving toward a minimum-viable Raycast extension renderer.

**Next (do this first — no new compiler/adapter yet):** finish approving and consolidating the current WIP as-is. Keep the builtin-definition renderer with leaf resolvers doing the work; solidify navigation, helpers, and related plumbing. Do not implement the proposed `compileThoughtsToInterface` / dual-path `InterfaceDefinition` language in this pass.

**Later (optional, after MVP renderer is solid):** reconsider whether a thoughts→definition compiler (and definition-first inline/placeholder interfaces with optional `id` / `tmp-${nanoid}`, `navigationTitle`, types under `renderer/{collections,markdown}` aggregated in `renderer/definitions.ts`) is worth it for easier internal authoring without hand-building thoughts/attributes/relations. Remember: if adopted, preserve real IDs/relations for deeplinks and child path parsing; `PushInterface` should accept nested definitions with parity to thoughts.

## Focus

Current focus is the iMessage POC path with production webhook flow, owned Postgres memory, and controlled local-dev routing for rapid message testing.

Secondary active slice: Raycast internal experimental Action Palette demo for opening ALTERED Core interfaces and installing Script Command shortcuts to those interfaces.

### Raycast monorepo HMR (implemented)

- `@raycast/api@1.104.20` patched via `pnpm.patchedDependencies` (`patches/@raycast__api@1.104.20.patch`) to honor `WATCH_PATHS` (comma-separated) in `ray develop`.
- `apps/raycast-internal-experimental` `dev` sets `WATCH_PATHS=../../packages/raycast-internal-experimental/dist`.
- Package exports stay on `import` → `dist`; HMR depends on package `tsc --watch` (via `pnpm dev:experimental`) updating `dist`, then the patched watcher triggering rebuild.
- Restart the Raycast app `dev` process to pick up the patch (existing sessions still run unpatched code until restarted).
- Plan: `.context/_generated/plans/raycast-monorepo-dev-watch.md`.

## Plan linkage

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

- Raycast package emit: `@altered/tooling/typescript/config/raycast.build.json` extends base build with `jsx` / `lib`. Base `build.json` `include` is `**/*.{ts,tsx}` so TSX packages emit without a duplicate include. `@altered/raycast-internal-experimental` uses extension-required exports (`./*.ts` / `./*.tsx` → `import`/`dist/*.js`); consumers must import with `.ts`/`.tsx` suffixes (e.g. `implementation.tsx`, `icons.ts`).

- Raycast internal experimental Action Palette:
  - `Capture Thought` added to the `ALTERED Core` interface collection.
  - Interface renderer supports a minimal form interface with a `content` text field.
  - Capture submit currently logs the content, closes the main window with suspended pop-to-root behavior, shows a success toast, then pops to root for the optimistic demo flow.
  - Collection items with interfaces expose `Install Shortcut`, which writes an executable Bash Script Command into Raycast `environment.supportPath`.
  - Installed Script Commands use `@raycast.packageName ALTERED`, the extension asset icon path, and a `createDeeplink` URL back to `action-palette`.
  - `Configure Shortcuts` added as a custom React interface that copies `environment.supportPath` and opens Raycast settings for the manual Script Commands directory setup.
  - Actions live in the Actions dataset; interface links use shared `INTERFACE_ID` schema (`value` = interface thought ID, or omit when the action thought is also in Interfaces).
  - `getActionInterfaceId({ actionId })` validates Actions membership (quiet `null` when not an action), optional `INTERFACE_ID` attribute → Interfaces check, else self if also in Interfaces.
  - `getCollectionItemInterfaceId({ itemId })` resolves list-row → interface via action resolver, else self when the row is already in Interfaces.
  - `action-palette` launch context still uses `actionId`; deeplink routing resolves to the linked interface thought ID for the navigation path.
  - Navigation history is prop-drilled per `InterfaceRenderer` instance (no shared `useCachedState` for the stack).
  - Path rule: every component ∈ Interfaces; each child must resolve as an interface of a parent collection item (not a bare row id).
  - **Chunk A model reshape (2026-07-12):** attributes `value: string` (no `thoughtIds`); schemas `text|thought|dataset|custom` + nullable `value` + `required` (default true in builtins); single `ALTEREDThoughtID` brand with `kind` discriminant; definition/relations authoring split retained until ID hoist (Chunk B). Collection item lists temporarily empty until dataset-id attribute values land in Chunk B.
  - **Chunk B (2026-07-13):** Brand tags use `@altered/<entity>/id`. Thought model is base + kind variants only (no def/relation types). Builtin IDs hoisted under `data/builtins/ids/`; full entity objects authored in `definitions/` (relations/ deleted). Actions + Collection Interface Items share `INTERFACE_ID` schema. Feature thoughts (e.g. `CAPTURE_THOUGHT`) unify action/row/interface via layered datasets. Collection item/group attrs store dataset IDs; leaf resolvers expand membership. `getActionInterfaceId` supports attribute link or self when the action is also in Interfaces.
  - **Chunk C + formatting (2026-07-14):** Builtin attr/schema/dataset object layout is `id` + `thoughtId`, blank, type props, blank, relations. Definition maps `satisfies Record<keyof typeof BUILTIN_*_IDS_MAP, …>`. Path/global-actions use `getCollectionItemInterfaceId` so children must be interfaces that trace from parent items.
  - **Navigation push guard (2026-07-14):** History stays prop-drilled per Raycast stack entry (no `useCachedState` for paths). `Go To Interface` uses `Action` + `useNavigation().push` only after `resolveNextNavigationPath` confirms a non-self, fully resolvable child. `PushNavigationAction` removed.
  - **Push-before-render gate (planned 2026-07-15):** Plan `.context/_generated/plans/raycast-push-interface-gate.md`. Gate type eligibility before Raycast `push` via `resolveRenderableInterface` + `pushInterface`; command root shares factory without push. Remove renderer `pop` for missing type. Gate on mount intent (root vs push), not history length.
  - App config aligned to monorepo tooling (2026-07-10): stock ESLint/Prettier/CommonJS Raycast template removed; extends `@altered/tooling/typescript/config/raycast.json` (`module: preserve` + `moduleResolution: bundler`); catalogs for `raycast` / `react`; `check:types` + `clean` scripts. Workspace package `exports` resolution works.

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

- Admin `/dev` forwarding preference:
  - Redis-backed persisted toggle added for admin phone numbers.
  - Failure mode hardened: if KV read/write fails, routing falls back to production handling (no webhook crash path).

- Preview deployment management direction (2026-05-24):
  - Build minimal MVP for `api-experimental` first, while shaping code for multi-app extension.
  - Use a stable preview domain target per app with auto-promote on non-main pushes and manual commit re-promote support.
  - Keep Vercel branch auto previews disabled; deploy manually through GitHub Actions + TypeScript scripts.
  - Keep webhook ingress behavior as `200 OK` to provider while handling forwarding failures internally.

- Effect conversion/retries/hardening pass: **deferred until post-POC stabilization**.

## Current risks and caveats

- Dedupe is not implemented yet; duplicate provider deliveries can still create repeated message rows/replies.

- Local/prod split testing currently requires standard deployment/tunnel switching; no in-band dev forwarding command yet.

- Keep Chat SDK thread iterators out of LLM truth path; Postgres remains canonical for context.

## Next execution order

1. Implement production webhook forwarding to local tunnel for **admin-only** **`/dev`** messages; strip routing prefix before persistence; on forward success return **`200` `OK`** from prod **without running** Chat SDK ingestion (same shape as `SendblueAdapter.handleWebhook` success responses). **Failure policy:** tunnel unreachable ⇒ return **`200` `OK`**, **no prod ingestion**, **no forward** (fixed response body; no thread side effects).

2. Add provider message-id dedupe guards in persistence path.

3. POC solidification: multi-bubble send pipeline (defer full timing emulation; see `.context/_generated/plans/imessage-human-timing-emulation.md`).

4. Final refactor/polish, then evaluate Effect migration effort for retries and error handling.
