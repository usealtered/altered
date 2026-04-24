# Monorepo architecture (final)

This document is the canonical description of how the ALTERED monorepo is structured: packages, apps, staging channels, composition layers, imports, database strategy, RPC typing, env handling, lint enforcement, and what we are explicitly not doing yet. Use it when wiring `pnpm-workspace.yaml`, Turborepo, Biome `no-restricted-imports`, and new workspaces.

## Source conversation

Design rationale and back-and-forth live in Cursor **parent** agent transcripts (JSONL). This repo’s transcripts directory:

`file:///Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered-4200/agent-transcripts/`

The thread that produced this plan is most likely the newest file by mtime (for example `…/9ac99a4f-c5f9-47f0-8597-038af1ee33b6/9ac99a4f-c5f9-47f0-8597-038af1ee33b6.jsonl`). If you need more nuance than this plan, open that JSONL in an editor or grep for keywords such as `composition`, `Hono`, or `Biome`.

**EDIT: ALL PLAN REFERENCES TO `<app_name>-components*` SHOULD BE UPDATED TO `@altered/<app_name>*`. THESE WILL STILL REMAIN AS TARGET COMPOSITION PACKAGES - WE JUST DON'T INCLUDE `-components` IN THE NAME.**

---

## Why this shape exists (design axes)

The workspace layout follows a small set of **orthogonal concerns**. Readers should map packages to these axes before adding new ones.

1. **Runtime / surface split (server vs client vs shared)**  
   **`server`** holds database, auth, Hono handlers, and data access. **`client`** holds typed HTTP usage (including Hono RPC client) for browsers and lightweight hosts. **`ui`** and **`raycast`** are presentation libraries (React DOM vs Raycast). **`core`** is shared contracts, types, env schema/loaders, and small cross-surface utilities—**not** a dumping ground for server-only code.

2. **Release quality (three public stages)**  
   Names are **outcome-focused**, not git branches. **`stable`** (no suffix in package names) means highly polished, strongly brand-aligned, and expected to change slowly. **`pre-release`** means broadly useful and reliable, visually and behaviorally “mostly there,” but still subject to pruning or revision. **`experimental`** means an **initial working, human-approved prototype**: dependable enough to use carefully, but without the same architectural or release guarantees as pre-release or stable.

3. **Public vs internal (internal channel packages)**  
   **Internal** surfaces (admin commands, extra routes, operator-only UI) are shipped in **workspace packages whose names include `internal`** (for example `@altered/server-internal-experimental`), so public bundles and deployables stay honest. Almost every **library** family can have an internal package for a given quality grade. **Exceptions (by design):** there are **no** separate `web-internal-experimental`, `web-components-internal-experimental`, `api-internal-experimental`, or `api-components-internal-experimental` apps or packages—**Next and API experimental deployables already provide a sane place** to embed internal behavior (gated admin API routes, gated Server Components / pages) **inside** `web-experimental`, `web-components-experimental`, `api-experimental`, and `api-components-experimental` instead of multiplying artifacts.

4. **Bundle weight (light vs regular)**  
   Raycast **bundles dependencies** without meaningful tree shaking; **`raycast`** and **`launcher-components-*`** stay as lean as practical. Next and the API can carry richer graphs; **`ui`** and **`web-components-*`** target React DOM. Boundaries are enforced so Raycast never accidentally imports server implementation or forbidden fat edges.

---

## Principles

- **Thin apps, fat packages.** Application directories hold framework entrypoints and configuration (Next config, Raycast manifest, Hono mount glue). Almost all product behavior lives in `packages/*`.
- **Staging is expressed as separate workspace packages**, not as git branches and not as a single Next app that switches channel at runtime. Channels are **quality grades** we keep deliberately separate.
- **Progressive refinement** for the three **public** channels: **`foo-pre-release` depends on `foo`**; **`foo-experimental` depends on `foo-pre-release`**. The same idea applies to **`@altered/<target>-components-*`** so experimental composition can extend pre-release without copying whole apps.
- **Raycast** bundles the whole dependency graph: launcher graphs stay lean; enforcement is package boundaries + Biome, not tree-shaking hope.
- **Enforcement over hope.** Allowed imports are documented here and mirrored in **Biome `no-restricted-imports`**, with **per-package `biome.json` files that extend the repo root** so rules stay co-located and are less likely to drift than a single giant root-only matrix.
- **Optional filesystem overlay / codegen-heavy app generation** are out of scope for now. If unintentional drift between the three web apps appears later, CI or agent-assisted checks are fair game; they are not part of the baseline architecture.

---

## Package naming: default is stable

Unless a suffix is present, a package name denotes the **stable** channel:

| Suffix | Meaning |
| ------ | ------- |
| *(none)* | **Stable** — default package, e.g. `@altered/core`, `@altered/web-components`. |
| `-pre-release` | **Pre-release** |
| `-experimental` | **Experimental** |
| `-internal-experimental` | **Internal at experimental grade** — internal channel variant (see exceptions below). |

There is **no** `-stable` suffix in names.

**Future internal grades (optional):** if we introduce **`@altered/<family>-internal-pre-release`**, then **`@altered/<family>-internal-experimental` should depend on it and re-export**, mirroring the public progressive chain. That yields **stacked internal surfaces** across composition: for example, if **`ui-internal-pre-release`** defines **PageA** and is used from **`web-components-pre-release`**, and later **`ui-internal-experimental`** adds **PageB** while extending **`ui-internal-pre-release`**, then **`web-components-experimental`**—which already sits on top of the public experimental stack—can compose both **PageA** and **PageB** without re-declaring PageA in the experimental internal package. Same pattern for **`server-internal-*`**, **`raycast-internal-*`**, etc.

There is **no** behavioral special case for **`server-internal-experimental`** versus any other **`@altered/<family>-internal-*`** package: **one internal model for every family.**

---

## Public channel grid (every family)

For each **library family** (`core`, `client`, `server`, `ui`, `raycast`), maintain **three** public workspace packages:

- `@altered/<family>`
- `@altered/<family>-pre-release`
- `@altered/<family>-experimental`

with the progressive dependency rule above.

---

## Internal channel packages (fourth line, almost everywhere)

For the same families, also maintain **`@altered/<family>-internal-experimental`** when operator-only or admin-only code deserves its **own workspace** (extra Raycast commands, duplicated routes under `/admin`, internal-only client helpers, etc.).

**Omit** these workspaces entirely (internal behavior lives **inside** the experimental web/api stack instead):

- `web-internal-experimental` (app) — use `web-experimental` + gates.
- `web-components-internal-experimental` — use `web-components-experimental` + gates.
- `api-internal-experimental` (app) — use `api-experimental` + gates.
- `api-components-internal-experimental` — use `api-components-experimental` + composition of internal **library** packages next to public ones.

**Keep** separate apps/packages where the platform requires it or separation is clearer, for example:

- **`launcher-internal-experimental`** app and **`@altered/launcher-components-internal-experimental`** (Raycast manifest cannot hide admin-only commands without a separate extension).
- **`@altered/raycast-internal-experimental`**, **`@altered/client-internal-experimental`**, **`@altered/core-internal-experimental`**, **`@altered/ui-internal-experimental`**, **`@altered/server-internal-experimental`**, etc., as needed.

### Unified rules for **all** `@altered/<family>-internal-*` packages

These rules apply equally to **`server-internal-experimental`**, **`raycast-internal-experimental`**, **`ui-internal-experimental`**, **`client-internal-experimental`**, **`core-internal-experimental`**, and any future **`*-internal-pre-release`**.

1. **Extension, not override.** An internal package **adds** routes, components, commands, types, or helpers. It does **not** replace or “become” the public package for the same family and grade. In particular, **`@altered/server-internal-experimental` must not import `@altered/server-experimental`** (and **`raycast-internal-experimental` must not import `raycast-experimental`**, etc.) as a way to patch or supersede the public tree—**composition** is where public and internal graphs meet.

2. **Same model for every family.** There is **no** separate “server-internal is unique” story. Server, Raycast UI, client, UI, and core internal packages all follow the same extension semantics and the same **progressive internal** rule when additional internal grades exist (`internal-pre-release` → `internal-experimental` inherits and re-exports).

3. **Composition merges public + internal.** **`web-components-*`**, **`api-components-*`**, and **`launcher-components-*`** import the **public** channel packages **and** the **internal** packages they need, and assemble the deployable surface (pages, Hono app, commands). That is where **PageA** (from an earlier internal pre-release package, if present) and **PageB** (from internal-experimental) both land in **`web-components-experimental`** when the dependency chain is wired that way.

4. **Apps stay thin.** **`api-experimental`** does not import **`server-internal-experimental`** directly; **`api-components-experimental`** composes **`server-experimental`** with **`server-internal-experimental`**. **`web-components-experimental`** may import **`server-internal-experimental`**, **`client-internal-experimental`**, **`ui-internal-experimental`**, etc., for gated composition. **`launcher-components-internal-experimental`** composes launcher public stacks with launcher-internal and other internal packages as policy allows.

### Optional future: feature / domain “contract” in composition

Not required for v1, but compatible with this layout: each **`*-components-*`** package could expose a **single checklist-style contract object** (features, domains, pages, command IDs) that implementing apps must satisfy—fields point at modules or file paths, or carry low-friction metadata (“used / not used”). If taken far enough, **TypeScript excess or missing-property errors** could signal **over-implementation or under-implementation** in an app relative to the contract. Treat this as an **aspirational** tool if drift or inventory management becomes painful; Biome import rules remain the baseline guardrail.

---

## Package families (all under `@altered/*`)

### `core` (+ `-pre-release`, `-experimental`, `-internal-experimental`)

- Shared **contracts**, **types**, **shared errors**, small **utilities**, and **Effect-based env schema and loading helpers**.
- **Hono RPC, contract-first:** **`AppType` and the route contract live in `core`**. **`client`** and **`server`** consume that contract from **`core`**. Prefer a **native** contract-first pattern with Hono as the ecosystem matures; **if** the documented path still pushes “export concrete server `typeof app` into clients,” treat **type-level equivalence helpers** (for example legacy **`AssertExactMatch`**) as an **honorable secondary fallback** so Raycast and other hosts never import server source for types, while implementations stay checked against `core`.
- **Environment:** client-safe vs server-only definitions live in **`core`**; Biome forbids importing server-only env entrypoints from browser-targeted code.
- **Does not** depend on `client`, `server`, `ui`, `raycast`, or any `*-components-*` package.

### `client` (+ channel + `client-internal-experimental`)

- Typed HTTP surface using **`hono/client`** against **`AppType` from `core`**, plus fetch/cookie helpers.
- **Does not** import `server` implementation.

### `server` (+ `-pre-release`, `-experimental` only in this subsection)

- Public-channel **`server`**, **`server-pre-release`**, **`server-experimental`**: Drizzle, auth, Hono **implementations**, data access.
- Depends on **`core`** (channel-aligned). **Does not** depend on `ui`, `raycast`, `*-components-*`, or **`server-internal-*`** (internal is composed next to public, not nested as a dependency of public `server`).

### `server-internal-experimental` (and future `server-internal-pre-release`, etc.)

- Same **internal extension** rules as every other **`@altered/<family>-internal-*`** package (see **Unified rules** above). **Additive** admin or operator routes (e.g. `/admin`), handlers, and helpers—**not** a `package.json` layer on top of **`server-experimental`**.

### `ui` (+ channel + `ui-internal-experimental`)

- **React DOM presentation only** (no remote/data orchestration).
- Depends on **`core`** (matching channel) unless a documented, linted exception exists.

### `raycast` (+ channel + `raycast-internal-experimental`)

- Raycast UI and Raycast-specific utilities.
- Depends on **`core`** by default; encode exceptions in Biome. **`raycast-internal-experimental`** follows the same extension rules as **`server-internal-experimental`** and does **not** import **`raycast-experimental`** to override it.

### Target composition: `@altered/<target>-components` (+ suffixes)

**Targets:** `web`, `launcher`, `api`.

**Packages:**

- **Web (three):** `@altered/web-components`, `@altered/web-components-pre-release`, `@altered/web-components-experimental`. **No** `web-components-internal-experimental` — internal Next composition ships in **`web-components-experimental`**.
- **API (three):** `@altered/api-components`, `@altered/api-components-pre-release`, `@altered/api-components-experimental`. **No** `api-components-internal-experimental` — compose **`server-internal-experimental`** inside **`api-components-experimental`** next to **`server-experimental`**, plus any other internal library packages the API needs.
- **Launcher (four):** `@altered/launcher-components`, `@altered/launcher-components-pre-release`, `@altered/launcher-components-experimental`, `@altered/launcher-components-internal-experimental`.

**Responsibilities:**

- **`web-components*`** — compose Next pages/layouts/route segments from **`server*`**, **`ui*`**, **`client*`**, **`core`**, and when needed **`server-internal-experimental`** (and other internal library packages) for gated surfaces, so **`ui`** stays free of data-loading.
- **`launcher-components*`** — compose Raycast commands/views from **`raycast*`**, **`client*`**, **`core`**, internal Raycast/client packages as needed, and other explicitly allowed deps per Biome.
- **`api-components*`** — compose the **final Hono app** from **`server*`**; **`api-components-experimental`** is the **integration point** that wires **`server-experimental`** and **`server-internal-experimental`** (and other internals) into **one** deployable app. **`api-experimental`** imports **`api-components-experimental`** only, not **`server-internal-experimental`** directly.

**Progressive composition:** `web-components-pre-release` depends on `web-components` plus pre-release tier **public** libraries and any **`internal-pre-release`** packages in use; `web-components-experimental` depends on `web-components-pre-release` plus experimental tier **public** libraries and the **internal-experimental** (and inherited internal) packages you compose. Same for `api-components*` and `launcher-components*` (launcher includes the fourth internal–experimental composition package).

---

## Apps (`apps/*`)

Each app is a **thin shell**: configs, manifests, minimal entry files that import from the matching **`@altered/<target>-components*`** package.

### Web (Next.js) — three apps

| App | Composition dependency |
| --- | ------------------------ |
| `web` | `@altered/web-components` |
| `web-pre-release` | `@altered/web-components-pre-release` |
| `web-experimental` | `@altered/web-components-experimental` |

Internal admin surfaces for web live **inside** `web-experimental` / `web-components-experimental`, not a fourth app.

### API — three apps

| App | Composition dependency |
| --- | ------------------------ |
| `api` | `@altered/api-components` |
| `api-pre-release` | `@altered/api-components-pre-release` |
| `api-experimental` | `@altered/api-components-experimental` |

`api-components-experimental` composes **`server-experimental`** and **`server-internal-experimental`** (and wires them); the app does not import `server-internal-experimental` directly.

### Launcher (Raycast) — four extension bundles

| App | Composition dependency |
| --- | ------------------------ |
| `launcher` | `@altered/launcher-components` |
| `launcher-pre-release` | `@altered/launcher-components-pre-release` |
| `launcher-experimental` | `@altered/launcher-components-experimental` |
| `launcher-internal-experimental` | `@altered/launcher-components-internal-experimental` |

A **fourth** Raycast extension exists because manifest-defined commands cannot be toggled per install without a separate binary or heavy codegen.

---

## Import and dependency rules (Biome + humans)

Implement with **`no-restricted-imports`** (and related rules) in **root-extending per-package `biome.json`**, plus CI.

### `core` and all `core-*` (including `core-internal-*`)

- **May import:** dev tooling only; no other `@altered/*` workspace packages.
- **Must not import:** `client`, `server`, `ui`, `raycast`, any `*-components-*`.

### `ui` / `raycast` and all public + internal variants

- **May import:** aligned `core` / `core-*` only (unless a documented, linted exception).
- **Must not import:** `server`, `client`, `*-components-*`.
- **Internal variants** must not import the **public same-family experimental** package to override it (e.g. **`ui-internal-experimental`** must not import **`ui-experimental`** for that purpose—same rule as **`server-internal-experimental`** vs **`server-experimental`**).

### `client` and all variants

- **May import:** aligned `core` / `core-*` for RPC types (`AppType`, etc.).
- **Must not import:** `server` implementation, `ui`, `raycast`, `*-components-*`.
- **`client-internal-*`:** must not import **`client-experimental`** as an override layer; add APIs alongside public `client` usage, composed in **`web-components-*`** / **`launcher-components-*`**.

### `server`, `server-pre-release`, `server-experimental`

- **May import:** aligned `core` / `core-*`.
- **Must not import:** `ui`, `raycast`, `*-components-*`, **`server-internal-*`**.

### All `@altered/<family>-internal-*` packages (unified)

- **May import:** **`core`** and aligned **`core-internal-*`** / **`core-experimental`** only as policy allows—keep graphs small and encode allowed edges in Biome.
- **Must not import:** the **public same-family `*-experimental`** package (no **`server-internal-experimental` → `server-experimental`**, no **`raycast-internal-experimental` → `raycast-experimental`**, etc.). **Composition** merges those worlds.
- **Must not** be imported from **`api-experimental`** directly when **`api-components-experimental`** is the integration surface; same “compose, don’t leak into app” pattern elsewhere as you add rules.

### `*-components-*`

- **May import:** matching-channel (or progressive-chain) **public** `server*`, `ui*`, `client*`, `raycast*`, `core*`, the **`internal-*`** packages required for that deployable, and previous `*-components-*` for the same target.
- **Must not import:** wrong-channel packages.
- **`api-components-experimental`:** must wire **`server-internal-experimental`** next to **`server-experimental`** (additive merge at the Hono layer).
- **`web-components-experimental`:** may wire **`server-internal-experimental`**, **`client-internal-experimental`**, **`ui-internal-experimental`**, etc., for gated composition.

### Apps

- **May import:** the **one** composition package for their target + channel, plus framework-only code.
- **Should not import:** raw `server*`, **`server-internal-experimental`**, or multiple sibling `*-components-*` packages unless explicitly documented.

### Cross-channel summary

Stable must not depend on pre-release or experimental. Pre-release must not depend on experimental. Experimental may reach earlier **public** channels **through** progressive package chains. **Internal** packages are **additive** and are **wired in composition** (and in **`web-components-experimental`** where applicable), not as `package.json` overrides of public **`*-experimental`** within the same family. **Internal** surfaces do not ship on stable or pre-release **deployables** unless you deliberately introduce **`internal-pre-release`** and compose it there.

---

## Database, Drizzle, and Neon branches

- A **Neon (or PlanetScale) branch** forks lineage from a point in time; branches diverge with migrations.
- **Per-channel schema evolution:** migrate experimental branches first; promote by merging migration artifacts, applying to more stable databases, running data scripts, then retiring experimental-only constructs intentionally.
- **Drizzle:** small schema modules + barrel; **one migration lineage per physical database branch**.

---

## Hono RPC

- Guide: [Hono RPC](https://hono.dev/docs/guides/rpc). Use **`strict`** TypeScript on both sides in the monorepo.
- **Contract in `core`**, implementations in **`server*`**; **`client*`** reads types from **`core`** only. Prefer ecosystem-native contract-first wiring; use **`AssertExactMatch`-style checks** only when needed as a **fallback**.

---

## Versioning, publishing, tests

- **Versioning:** Changesets later; `0.1.0`-style is fine early.
- **Publishing:** push-publish where appropriate; Raycast via a **dedicated GitHub Action** when added.
- **Integrity:** Biome import matrix; RPC alignment under **`tsc --strict`**. Optional later: smoke E2E, sparse contract tests.

---

## Non-goals (explicit)

- Filesystem overlay merges for Next channel variants.
- Heavy codegen that harms day-to-day DX.
- A large automated UI test matrix from day one.
- Separate **web** or **api** `*-internal-experimental` **apps or composition packages** (internal ships inside **`*-experimental`** for those targets).

---

## Implementation checklist (when scaffolding)

1. Scaffold **`@altered/<family>`**, **`<family>-pre-release`**, **`<family>-experimental`**, and **`<family>-internal-experimental`** for `core`, `client`, `server`, `ui`, `raycast` as needed—**excluding** the four omitted web/api internal workspaces listed above.
2. Scaffold **`web-components*`** (three), **`api-components*`** (three), **`launcher-components*`** (four, including internal–experimental).
3. Scaffold **apps**: three web, three api, four launcher—**no** `web-internal-experimental` or `api-internal-experimental`.
4. Root + **per-package** Biome `extends` + `no-restricted-imports` (include **“internal must not import public same-family experimental”** for each family you ship).
5. Turborepo task graph for channels.
6. First vertical slice: **`AppType` in `core`**, handler in **`server`**, client in **`client`**, Raycast proof without server source imports.
