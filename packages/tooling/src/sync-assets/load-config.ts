import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { build, type Plugin } from "esbuild"
import type { SyncAssetsConfig } from "./types"

const assetFilePattern = /\.(png|ico|jpe?g|webp|svg|woff2?|ttf|otf)$/i

const assetPathLoader: Plugin = {
    name: "asset-path-loader",

    setup(buildApi) {
        buildApi.onLoad({ filter: assetFilePattern }, async loadArguments => ({
            contents: `export default ${JSON.stringify(loadArguments.path)}`,
            loader: "js"
        }))
    }
}

/**
 * @remarks Bundles and evaluates a `sync-assets.config.ts` module with asset imports resolved to absolute paths.
 */
async function loadSyncAssetsConfig(
    configPath: string
): Promise<SyncAssetsConfig> {
    const absoluteConfigPath = resolve(configPath)
    const temporaryDirectory = mkdtempSync(
        join(tmpdir(), "altered-sync-assets-")
    )
    const outputFile = join(temporaryDirectory, "sync-assets.config.mjs")

    try {
        await build({
            absWorkingDir: dirname(absoluteConfigPath),
            bundle: true,
            entryPoints: [absoluteConfigPath],
            format: "esm",
            outfile: outputFile,
            platform: "node",
            plugins: [assetPathLoader],
            target: "esnext",
            write: true
        })

        const loadedModule = await import(pathToFileURL(outputFile).href)
        const config = loadedModule.default

        if (!config || typeof config !== "object")
            throw new Error(
                `"${configPath}" must default-export a sync assets config.`
            )

        if (!Array.isArray(config.include))
            throw new Error(`"${configPath}" is missing an "include" array.`)

        return config as SyncAssetsConfig
    } finally {
        rmSync(temporaryDirectory, { force: true, recursive: true })
    }
}

export { loadSyncAssetsConfig }
