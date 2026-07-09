import type { LaunchProps } from "@raycast/api"
import { ArkErrors } from "arktype"
import {
    ACTION_PALETTE_INTERFACE_ID,
    actionPaletteLaunchContextSchema,
    actionPaletteRoot
} from "./definitions"
import { InterfaceRenderer } from "./interfaces/renderer"
import { formatNavigationPath } from "./interfaces/resolve-navigation-path"
import { resolveActionPaletteNavigationPath } from "./resolve-action-path"

/**
 * @todo P2: Implement support for `navigationStyle: "full" | "direct"` (or similar) for optional deeplink history expansion. See [Cursor chat](file:///Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered/agent-transcripts/d13781eb-7f15-47fd-9962-23c433f8e0cf/d13781eb-7f15-47fd-9962-23c433f8e0cf.jsonl).
 */
function ActionPaletteCommand(props: LaunchProps) {
    const optionalLaunchContextSchema =
        actionPaletteLaunchContextSchema.or("undefined")

    const launchContext = optionalLaunchContextSchema(props.launchContext)

    if (launchContext instanceof ArkErrors)
        console.warn("Invalid launch context, ignoring.", {
            error: launchContext.summary
        })
    else if (launchContext)
        console.log("Launch context detected:", { launchContext })

    const safeLaunchContext =
        launchContext instanceof ArkErrors ? undefined : launchContext

}

export { ActionPaletteCommand }
