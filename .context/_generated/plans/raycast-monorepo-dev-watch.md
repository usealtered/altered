# Raycast monorepo hot-reload (`ray develop` watch)

## Problem

`apps/raycast-internal-experimental` is a thin shell. Real code lives in workspace packages (`@altered/raycast-internal-experimental`, `@altered/core-experimental`). `pnpm dev:experimental` no longer HMR those packages because `ray develop` only watches the extension cwd.

## How `ray develop` actually works (`@raycast/api@1.104.20`)

Source: `node_modules/@raycast/api/dist/commands/develop/index.js` (bundled).

1. **CLI flags** — only hidden debug flags (`print-tool-schemas`, etc.). **No watch-path / watch-root args.** Confirmed via `oclif.manifest.json`.

2. **Watcher** — chokidar (`followSymlinks: true` by default). Created empty, then paths are added:

```text
package.json, HELP.md / Help.md / help.md,
ai.json / ai.yml / ai.yaml,
src, assets
```

Ignore pattern is only `/^(\.|~).*/` (dotfiles / `~`). Nothing else is configurable.

3. **Rebuild** — on any watched `all` event, re-runs the full esbuild extension build (`aDe` → `aZe`).

4. **Bundle resolution** — esbuild `platform: "node"` with no custom `conditions`. Workspace package `exports` use `"import": "./dist/*.js"`, so the bundle reads **`dist/`**, not `src/`. Verified: metafile inputs are `packages/*/dist/**`.

5. **Externals** — only `@raycast/api`, `react`, `react-devtools-raycast`, `@parcel/source-map` (+ package.json `external`). Workspace packages are **bundled**, so a rebuild is required when they change.

## Why turbo `dev` alone is insufficient

Package `dev` scripts already run `tsc --watch` → `dist` updates. Ray never sees those files, so it never rebuilds.

## Options (ranked)

### 1. Recommended — `pnpm` patch + env-driven extra watch paths

Patch the tiny `pZe` path-registration block so that after the stock `lT(...)` calls it also adds paths from e.g. `WATCH_PATHS` (comma-separated).

App script:

```json
"dev": "WATCH_PATHS=../../packages/raycast-internal-experimental/dist,../../packages/core-experimental/dist ray develop"
```

**Why this wins**

- Fixes the real gap (watcher scope), not a side-channel.
- Stable with pinned `@raycast/api` (`catalog:raycast` → `1.104.20`).
- Reproducible via `pnpm.patchedDependencies` (no ad-hoc manual patch script).
- Watches **`dist`**, matching what esbuild reads — avoids the race of rebuilding on `src` before `tsc` finishes.
- Does **not** watch the whole monorepo (their ignore list is too weak for that; `node_modules` would get swept in).

Patch surface is one function (~add ~5 lines after existing `lT` calls). Keep the patch small; re-apply when bumping `@raycast/api`.

### 2. Acceptable fallback — touch-file wrapper (no patch)

Concurrent: chokidar on package `dist/` → rewrite `apps/.../src/.reload-trigger.ts` → stock `ray develop`.

Works without touching `@raycast/api`, but is a second watcher + pollutes `src`. Prefer only if patching is rejected.

### 3. Reject / deprioritize

| Idea | Verdict |
|------|---------|
| Official `ray develop` watch args | **Does not exist** |
| Symlink packages under `src/` | Triggers on package `src` while esbuild reads `dist` → stale-first rebuild race; pollutes app tree |
| Cursor / VS Code save hook → hash file | Only covers editor saves; incomplete for agents/other tools |
| Watch monorepo root | Unsafe with current ignore regex; need a much richer ignore set |
| Point `import` exports at `src` for Raycast packages | Helps skip `tsc` for HMR, but still needs watcher expansion; keep as optional follow-up, not the primary fix |

## Implementation sketch (when approved)

1. `pnpm patch @raycast/api@1.104.20` → extend `pZe` to read `process.env.WATCH_PATHS`, `split(",")`, `lT` each non-empty trimmed path.
2. Commit patch under `patches/` and register in `package.json` / `pnpm-workspace` patchedDependencies.
3. Update `apps/raycast-internal-experimental` `dev` script with explicit `dist` paths for raycast + core experimental packages.
4. Confirm `turbo dev --filter=*experimental` still runs package `tsc --watch` alongside app `ray develop`.
5. Manual verify: edit a package file → `tsc` writes `dist` → ray logs `changed file ...` → extension reloads.

## Status

**Implemented (2026-07-14):**

- `patches/@raycast__api@1.104.20.patch` — after stock `lT` paths, also registers `WATCH_PATHS` (comma-separated).
- Registered in `pnpm-workspace.yaml` `patchedDependencies`.
- App `dev`: `WATCH_PATHS=../../packages/raycast-internal-experimental/dist ray develop`.

Restart the running `ray develop` / `pnpm dev:experimental` Raycast task to load the patched package.
