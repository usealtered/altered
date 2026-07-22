/// <reference types="@altered/tooling/types/asset-imports" />

import type { SyncAssetsRegistry } from "@altered/tooling/sync-assets/types"
import experimentalIconSrc from "./assets/raycast-internal-experimental-icon-tmp.png"

/**
 * @remarks Package-side sync asset registry for `@altered/api-experimental`.
 */
export const apiExperimentalAssets = {
    experimentalIcon: experimentalIconSrc
} satisfies SyncAssetsRegistry
