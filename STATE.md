# State

Last updated: 2026-07-05

## Source

Cursor agent transcript: [Global default favicon & sync-assets pipeline](/Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered/agent-transcripts/fda9479a-3b9c-4add-bab1-7dcd0318cf11/fda9479a-3b9c-4add-bab1-7dcd0318cf11.jsonl)

Initial request: add experimental API favicon from ingest icon, composable via packages, CDN-served on Vercel.

## Current state

### Favicon & static assets

- **`altered-sync-assets`** CLI in `@altered/tooling` syncs package source blobs into app `public/` for Vercel CDN serving.
- **Config files:** `sync-assets.config.ts` at package (registry export) and app (consumer mappings).
- **Types:** `SyncAssetsConfig`, `SyncAssetsRegistry`, `SyncAssetsIncludeEntry`, transform types — all prefixed `SyncAssets*`.
- **Config shape:** `outDir`, `include` (`src` / `dest` / optional `transforms`), `exclude`.
- **Transforms:** `resize` and `convert` via `sharp` + `to-ico` (no OS-level ImageMagick/ffmpeg).
- **Watch:** `@parcel/watcher` with `outDir` ignored to prevent sync loops; debounced incremental sync in dev.
- **Build:** clean sync (preserving `README.md`, `.gitkeep`, and `exclude` entries) then repopulate.

### Favicon demo (`api-experimental`)

- Source: `packages/api-experimental/assets/raycast-internal-experimental-icon-tmp.png` (512×512 master).
- Registry: `packages/api-experimental/sync-assets.config.ts` exports `apiExperimentalAssets`.
- App mapping: resize to 32×32 → convert to `favicon.ico` in `apps/api-experimental/public/`.
- Local dev: `serveStatic({ root: "./public" })` in app shell when not on Vercel.
- Production: Vercel serves `public/favicon.ico` from CDN (no Hono route).

### Public directory conventions

- App `public/` is generated; tracked exceptions via app `.gitignore` + `exclude` in config.
- `public/README.md` documents the generated-directory policy; excluded from CDN via `.vercelignore`.
- Asset import types: `@altered/tooling/types/asset-imports` (referenced via co-located `tooling.d.ts`).

### Removed

- Hono favicon routes and in-code byte serving.
- `assets.config.ts` naming and old `src/assets/` blob location.

## Deferred

- `@todo P2`: Typed public URL constant generation from sync config.
- `@todo P2`: Turbo task caching for sync in CI.
- `@todo P2`: Remote/network source URLs for sync inputs.

## Branch context

Work stashed after this state snapshot on `feat/add-api-favicon`.
