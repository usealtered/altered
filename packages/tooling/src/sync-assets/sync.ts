import {
    accessSync,
    constants,
    copyFileSync,
    existsSync,
    mkdirSync,
    readdirSync,
    rmSync,
    writeFileSync
} from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import {
    PUBLIC_DIRECTORY_KEEP_FILES,
    PUBLIC_DIRECTORY_README_CONTENT,
    PUBLIC_DIRECTORY_README_FILENAME
} from "./constants"
import { loadSyncAssetsConfig } from "./load-config"
import { applySyncAssetTransforms } from "./transform"
import type { SyncAssetsConfig, SyncAssetsIncludeEntry } from "./types"

type SyncAssetsOptions = Readonly<{
    clean?: boolean
    configPath?: string
    workingDirectory?: string
}>

function assertRelativeDestinationPath(destination: string) {
    if (destination.startsWith("/"))
        throw new Error(`Destination "${destination}" must be relative.`)

    if (destination.includes(".."))
        throw new Error(`Destination "${destination}" must not contain "..".`)
}

function assertSourcePath(sourcePath: string) {
    try {
        accessSync(sourcePath, constants.R_OK)
    } catch {
        throw new Error(
            `Asset source "${sourcePath}" does not exist or is unreadable.`
        )
    }
}

function collectPreservedFilenames(config: SyncAssetsConfig) {
    return new Set([...PUBLIC_DIRECTORY_KEEP_FILES, ...(config.exclude ?? [])])
}

function ensurePublicReadmeFile(publicDirectory: string) {
    const readmePath = join(publicDirectory, PUBLIC_DIRECTORY_README_FILENAME)

    if (existsSync(readmePath)) return

    writeFileSync(readmePath, PUBLIC_DIRECTORY_README_CONTENT, "utf8")
}

function cleanPublicDirectory(
    publicDirectory: string,
    preservedFilenames: ReadonlySet<string>
) {
    if (!existsSync(publicDirectory)) return

    for (const entry of readdirSync(publicDirectory, { withFileTypes: true })) {
        if (preservedFilenames.has(entry.name)) continue

        rmSync(join(publicDirectory, entry.name), {
            force: true,
            recursive: entry.isDirectory()
        })
    }
}

async function syncIncludeEntry(
    entry: SyncAssetsIncludeEntry,
    publicDirectory: string,
    workingDirectory: string
) {
    assertRelativeDestinationPath(entry.dest)
    assertSourcePath(entry.src)

    const destinationPath = resolve(publicDirectory, entry.dest)

    mkdirSync(dirname(destinationPath), { recursive: true })

    if (entry.transforms && entry.transforms.length > 0)
        await applySyncAssetTransforms(
            entry.src,
            destinationPath,
            entry.transforms
        )
    else copyFileSync(entry.src, destinationPath)

    console.log(
        `Synced ${relative(workingDirectory, entry.src)} -> ${relative(workingDirectory, destinationPath)}`
    )
}

/**
 * @remarks Copies configured assets into the app public directory.
 *
 * @todo P2: Add Turbo task caching for clean sync runs in CI.
 * @todo P2: Generate typed public URL constants from sync-assets.config.ts.
 */
async function syncAssets(options: SyncAssetsOptions = {}) {
    const workingDirectory = resolve(options.workingDirectory ?? process.cwd())
    const configPath = options.configPath ?? "sync-assets.config.ts"
    const config = await loadSyncAssetsConfig(
        resolve(workingDirectory, configPath)
    )
    const publicDirectory = resolve(workingDirectory, config.outDir ?? "public")
    const preservedFilenames = collectPreservedFilenames(config)

    mkdirSync(publicDirectory, { recursive: true })
    ensurePublicReadmeFile(publicDirectory)

    if (options.clean) cleanPublicDirectory(publicDirectory, preservedFilenames)

    for (const entry of config.include)
        await syncIncludeEntry(entry, publicDirectory, workingDirectory)

    return {
        config,
        include: config.include,
        outDir: config.outDir ?? "public",
        publicDirectory,
        workingDirectory
    }
}

export type { SyncAssetsOptions }
export { syncAssets }
