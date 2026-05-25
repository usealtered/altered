---
name: api-experimental preview promotion
overview: "Minimal, fast path to stable preview promotion for `api-experimental` using GitHub Actions + TypeScript scripts + Vercel API/aliasing, with auto-promote on push and manual commit promote support. Designed to extend to additional app variants later."
todos:
  - id: spike-vercel-domain-assignment
    content: "Prove whether custom preview domain can be reassigned via API alias without branch-bound Preview environment configuration."
    status: pending
  - id: tooling-preview-modules
    content: "Implement reusable preview deployment/promotion modules in `@altered/tooling`."
    status: pending
  - id: scripts-root-wiring
    content: "Wire root scripts for auto-promote and manual commit promotion for api-experimental."
    status: pending
  - id: gh-workflow-manage-deployments
    content: "Create Blacksmith-backed workflow with CI checks plus preview auto/manual jobs."
    status: pending
  - id: vercel-secrets-vars
    content: "Define required GitHub secrets/vars and verify least-privileged token scope."
    status: pending
  - id: mvp-verification
    content: "Run end-to-end tests for auto-promote, manual SHA promote, and rollback by SHA."
    status: pending
isProject: false
---

# Preview promotion plan (MVP first)

## Outcome

Ship a stable preview URL for `api-experimental` at `preview.experimental.api.usealtered.com` that:

- Auto-promotes on non-main pushes.
- Allows manual promotion to a specific commit SHA.
- Avoids PR/merge churn for branch testing.
- Keeps provider webhook response behavior stable (`200 OK` outward, internal error handling inward).

## Scope and non-scope

- **In scope (now):** `api-experimental` only.
- **In scope (design):** reusable implementation so later apps (`api-pre-release`, `web-pre-release`, etc.) are config additions, not rewrites.
- **Out of scope (this plan):** repo remote migration, org transfer tasks, and license setup.
- **Out of scope (MVP):** iMessage deployment notifications, cross-variant runtime routing, dashboards, pre-commit target selectors.

## Constraints and assumptions

- Vercel Hobby constraints apply (no Custom Environments, no paid preview suffix add-on).
- Preview auto-branch deployments in Vercel are disabled to reduce noise/cost.
- Deployment orchestration occurs from GitHub Actions + TypeScript scripts.
- Blacksmith runners are used for workflow execution.

## Key technical decision

Use **SHA-driven deployment + domain alias reassignment** as the primary mechanism, not branch mirror promotion.

- Preferred flow: create deployment from commit SHA -> wait ready -> assign `preview.experimental.api.usealtered.com` alias to that deployment.
- Branch mirrors like `preview/<app>` are fallback-only if Vercel enforces branch eligibility in a way API aliasing cannot bypass.

## Phase 0: fast feasibility spike (required first)

Goal: remove ambiguity around Vercel branch eligibility for preview domains.

1. Create one preview deployment for `api-experimental` from a known non-main SHA.
2. Attempt alias assignment via Vercel API to `preview.experimental.api.usealtered.com`.
3. Confirm whether assignment succeeds without branch-linked Preview environment settings.

Acceptance:

- **Pass:** Domain resolves to targeted deployment and remains mutable via re-alias.
- **Fail:** Domain assignment blocked by branch eligibility; activate fallback strategy:
  - Maintain one mirror branch `preview/api-experimental` only for domain eligibility.
  - Continue SHA-level observability in metadata.

## Phase 1: reusable TypeScript orchestration

Implement in `@altered/tooling` (new preview modules + bin entrypoints):

- `preview/config`:
  - App registry keyed by app slug (`api-experimental`).
  - Domain, Vercel project id/name, and deployment metadata mapping.
- `preview/vercel-client`:
  - Minimal typed wrappers for deploy create, deploy status polling, and alias assign.
- `preview/promote`:
  - `promotePreviewBySha({ app, sha, mode })` where `mode` is `auto` or `manual`.
  - Structured logs and deterministic exit codes.
- `preview/resolve`:
  - Resolve source SHA from push context (for auto mode).
  - Accept explicit SHA arg (manual mode).

Bin commands:

- `altered-preview-auto-promote`
- `altered-preview-promote`

## Phase 2: root script contract

Root `package.json` scripts:

- `preview:auto:api-experimental`
- `preview:promote:api-experimental`

Manual command target:

- `pnpm preview:promote:api-experimental <commit-sha>`

Behavior:

- Always prints deploy URL + inspector URL + stable preview domain.
- Fails loudly in CI logs; no silent partial success.

## Phase 3: workflow design (`manage-deployments.yml`)

Keep naming/semantic style close to prior repo while modernizing structure.

Triggers:

- `push` on `**` with `main` excluded in job condition.
- `workflow_dispatch` with `app` (default `api-experimental`) and `commit_sha`.

Jobs:

1. `check` (Blacksmith):
   - Setup pnpm/node.
   - Run `pnpm check`.
2. `preview` (auto promote):
   - Needs `check`.
   - Runs on non-main pushes.
   - Runs `pnpm preview:auto:api-experimental`.
3. `preview-manual-promote`:
   - Runs only on `workflow_dispatch`.
   - Runs `pnpm preview:promote:api-experimental ${{ inputs.commit_sha }}`.

Notes:

- No Discord notification logic in MVP.
- Keep workflow step names explicit and visually grouped.

## Phase 4: secret/variable model

GitHub repository configuration:

- **Secrets:** `VERCEL_TOKEN`
- **Variables:** `VERCEL_TEAM_ID` (if team scope required), `VERCEL_PROJECT_ID_API_EXPERIMENTAL`

Domain data should live in code config for traceability, not ad hoc workflow literals.

## Phase 5: verification checklist

Run and confirm:

1. Push to non-main branch -> `check` passes -> preview auto-promotes.
2. Run manual promote with older SHA -> preview domain re-points successfully.
3. Re-run with current SHA -> rollback/forward works deterministically.
4. Webhook forwarding path continues provider-facing `200 OK` behavior.

## Future extensions (deferred, captured)

- **Notifications:** send deployment updates to iMessage (compact), linking out to GitHub/Vercel details.
- **Variant targeting:** reusable routing target key (e.g. `preview.pre-release`) for admin `/target` command.
- **Multi-app rollout:** extend app registry and fan-out workflow by changed apps.
- **Selective promotion controls:** optional Turbo-aware affected gating and manual include/exclude flags.
- **Forwarding kernel:** extract webhook/request forwarding into shared module with retries/backoff hooks.

### Turbo integration path (deferred)

- **Affected promotion gate:** before creating a deployment, run a Turbo affected check scoped to the target app stack; skip promotion when no relevant package/app changed.
- **Per-app promotion matrix:** once multiple app variants exist, compute changed targets and fan out only those preview promotion jobs.
- **Cache-aware CI split:** keep `pnpm check` as the global quality gate, but run app-scoped build/check tasks with Turbo filters to maximize cache hits.
- **Stable task contracts:** ensure each app package has consistent `build`/`check:types`/`check:style` task definitions and cacheable outputs so promotion pipelines benefit from remote/local Turbo cache.
- **Manual override flag:** support an explicit force mode (e.g. `--force-promote`) to bypass affected gating when operators want to promote despite unchanged app code.

## Risks and mitigations

- **Risk:** Vercel domain assignment requires branch-bound eligibility.
  - **Mitigation:** Phase 0 spike + single-branch fallback (`preview/api-experimental`) only if required.
- **Risk:** over-deployment cost/noise as variants grow.
  - **Mitigation:** keep MVP single-app; add changed-app gating before multi-app enablement.
- **Risk:** token scope misuse.
  - **Mitigation:** least-privileged token and explicit env variable contract.

## Execution order

1. Phase 0 feasibility spike.
2. Tooling module implementation in `@altered/tooling`.
3. Root script wiring.
4. `manage-deployments.yml` with Blacksmith + checks + auto/manual promotion.
5. End-to-end verification and rollback test.
