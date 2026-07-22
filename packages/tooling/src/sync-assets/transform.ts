import { writeFileSync } from "node:fs"
import sharp from "sharp"
import toIco from "to-ico"
import type {
    SyncAssetsConvertTransform,
    SyncAssetsResizeTransform,
    SyncAssetsTransform
} from "./types"

function resolveResizeDimensions(transform: SyncAssetsResizeTransform) {
    if (transform.size !== undefined)
        return { height: transform.size, width: transform.size }

    if (transform.width === undefined || transform.height === undefined)
        throw new Error(
            'Resize transform requires either "size" or both "width" and "height".'
        )

    return { height: transform.height, width: transform.width }
}

async function applyConvertTransform(
    image: sharp.Sharp,
    transform: SyncAssetsConvertTransform
) {
    if (transform.format === "ico") {
        const pngBuffer = await image.png().toBuffer()

        return toIco([pngBuffer])
    }

    if (transform.format === "jpeg") return image.jpeg().toBuffer()

    if (transform.format === "webp") return image.webp().toBuffer()

    return image.png().toBuffer()
}

/**
 * @remarks Applies configured transforms and writes the result to the destination path.
 *
 * @todo P2: Support remote source URLs downloaded at sync time.
 */
async function applySyncAssetTransforms(
    sourcePath: string,
    destinationPath: string,
    transforms: readonly SyncAssetsTransform[]
) {
    let image = sharp(sourcePath, { density: 300 })

    const convertTransforms: SyncAssetsConvertTransform[] = []
    const resizeTransforms: SyncAssetsResizeTransform[] = []

    for (const transform of transforms)
        if (transform.type === "resize") resizeTransforms.push(transform)
        else convertTransforms.push(transform)

    for (const transform of resizeTransforms) {
        const dimensions = resolveResizeDimensions(transform)

        image = image.resize(dimensions.width, dimensions.height, {
            fit: "contain"
        })
    }

    if (convertTransforms.length > 1)
        throw new Error(
            "Only one convert transform is supported per include entry."
        )

    const convertTransform = convertTransforms.at(0)
    const outputBuffer = convertTransform
        ? await applyConvertTransform(image, convertTransform)
        : await image.toBuffer()

    writeFileSync(destinationPath, outputBuffer)
}

export { applySyncAssetTransforms }
