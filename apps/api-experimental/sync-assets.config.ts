import { apiExperimentalAssets } from "@altered/api-experimental/sync-assets.config"
import type { SyncAssetsConfig } from "@altered/tooling/sync-assets/types"

export default {
    outDir: "public",

    include: [
        {
            dest: "favicon.ico",
            src: apiExperimentalAssets.experimentalIcon,
            transforms: [
                { size: 32, type: "resize" },
                { format: "ico", type: "convert" }
            ]
        }
    ]
} satisfies SyncAssetsConfig
