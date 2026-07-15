import { BUILTIN_THOUGHTS_MAP } from "@altered/core-experimental/data/builtins/definitions/thoughts"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { LaunchProps } from "@raycast/api"
import { type } from "arktype"
import { getActionInterfaceId } from "../../data/access/get-action-interface-id"
import { InterfaceRenderer } from "../../renderer/implementation"
import { encodeNavigationPath } from "../../renderer/navigation/encode-path"
import { resolveLaunchContext } from "../../utils/resolve-launch-context"

function ActionPaletteCommand(props: LaunchProps) {
    const launchContext = resolveLaunchContext(props.launchContext, {
        schema: { actionId: type("string").as<ALTEREDThoughtID>() }
    })

    const targetInterfaceId = getActionInterfaceId({
        actionId: launchContext?.actionId
    })

    const navigationHistory = [
        encodeNavigationPath({
            components: targetInterfaceId
                ? [BUILTIN_THOUGHTS_MAP.ACTION_PALETTE.id, targetInterfaceId]
                : [BUILTIN_THOUGHTS_MAP.ACTION_PALETTE.id]
        })
    ]

    return <InterfaceRenderer navigationHistory={navigationHistory} />
}

export { ActionPaletteCommand }
