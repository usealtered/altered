# Generated public directory

This application's `public/` directory is primarily populated by `altered-sync-assets` from `sync-assets.config.ts`.

Do not add files here unless you intentionally want them deployed to the CDN.

To track a file in git:

1. Add its filename to `exclude` in `sync-assets.config.ts`.
2. Re-include it in this app's `.gitignore` (for example `!public/your-file.ext`).
3. Add it to `.vercelignore` if it should not be served.

Synced assets are removed on build sync unless excluded.
