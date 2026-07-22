import { dirname, resolve } from "node:path"
import { subscribe } from "@parcel/watcher"
import { syncAssets } from "./sync"

type WatchSyncAssetsOptions = Readonly<{
    configPath?: string
    workingDirectory?: string
}>

/**
 * @remarks Watches asset sources and config, syncing incrementally without cleaning `public/`.
 */
async function watchSyncAssets(options: WatchSyncAssetsOptions = {}) {
    const workingDirectory = resolve(options.workingDirectory ?? process.cwd())
    const configPath = options.configPath ?? "sync-assets.config.ts"
    const absoluteConfigPath = resolve(workingDirectory, configPath)

    let debounceTimer: ReturnType<typeof setTimeout> | undefined
    let syncInProgress = false

    const scheduleSync = () => {
        if (debounceTimer) clearTimeout(debounceTimer)

        debounceTimer = setTimeout(() => {
            if (syncInProgress) return

            syncInProgress = true

            void syncAssets({
                clean: false,
                configPath,
                workingDirectory
            }).finally(() => {
                syncInProgress = false
            })
        }, 100)
    }

    const initialResult = await syncAssets({
        clean: false,
        configPath,
        workingDirectory
    })

    const watchedDirectories = collectWatchedDirectories(
        initialResult.include,
        absoluteConfigPath
    )

    const outputIgnorePattern = `**/${initialResult.outDir}/**`

    console.log(`Watching ${watchedDirectories.length} asset director(ies).`)

    const handleWatchEvent: Parameters<typeof subscribe>[1] = (
        error,
        events
    ) => {
        if (error) throw error

        if (events.length === 0) return

        const relevantEvents = events.filter(
            event => !event.path.includes(`/${initialResult.outDir}/`)
        )

        if (relevantEvents.length === 0) return

        console.log(
            `Asset change detected (${relevantEvents.length} event(s)); syncing.`
        )

        scheduleSync()
    }

    await Promise.all(
        watchedDirectories.map(directory =>
            subscribe(directory, handleWatchEvent, {
                ignore: [
                    "**/.git/**",
                    "**/node_modules/**",
                    outputIgnorePattern
                ]
            })
        )
    )
}

function collectWatchedDirectories(
    include: ReadonlyArray<{ src: string }>,
    configPath: string
) {
    const directories = new Set<string>([dirname(configPath)])

    for (const entry of include) directories.add(dirname(resolve(entry.src)))

    return [...directories]
}

export type { WatchSyncAssetsOptions }
export { watchSyncAssets }
