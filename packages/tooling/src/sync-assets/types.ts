/**
 * Recursive package-side asset registry. Leaf values are absolute source paths.
 */
type SyncAssetsRegistry = {
    readonly [key: string]: string | SyncAssetsRegistry
}

type SyncAssetsResizeTransform = Readonly<{
    height?: number
    size?: number
    type: "resize"
    width?: number
}>

type SyncAssetsConvertTransform = Readonly<{
    format: "ico" | "jpeg" | "png" | "webp"
    type: "convert"
}>

type SyncAssetsTransform =
    | SyncAssetsConvertTransform
    | SyncAssetsResizeTransform

type SyncAssetsIncludeEntry = Readonly<{
    dest: string
    src: string
    transforms?: readonly SyncAssetsTransform[]
}>

/**
 * App-side asset sync configuration.
 */
type SyncAssetsConfig = Readonly<{
    /**
     * Filenames preserved in {@link SyncAssetsConfig.outDir} during clean syncs.
     */
    exclude?: readonly string[]

    include: readonly SyncAssetsIncludeEntry[]

    /**
     * Output directory for CDN-served files, relative to the app root.
     *
     * @defaultValue `"public"`
     */
    outDir?: string
}>

export type {
    SyncAssetsConfig,
    SyncAssetsConvertTransform,
    SyncAssetsIncludeEntry,
    SyncAssetsRegistry,
    SyncAssetsResizeTransform,
    SyncAssetsTransform
}
