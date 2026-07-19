import { BUILTIN_THOUGHTS_MAP } from "@altered/core-experimental/data/builtins/definitions/thoughts"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { LaunchProps } from "@raycast/api"
import { type } from "arktype"
import { resolveActionInterfaceThought } from "../../data/resolvers/action-interface-thought"
import { InterfaceRenderer } from "../../renderer/implementation"
import { encodeNavigationPath } from "../../renderer/navigation/encode-path"
import { resolveLaunchContext } from "../../utils/resolve-launch-context"

function ActionPaletteCommand(props: LaunchProps) {
    const launchContext = resolveLaunchContext(props.launchContext, {
        schema: { actionId: type("string").as<ALTEREDThoughtID>() }
    })

    const targetInterface = launchContext
        ? resolveActionInterfaceThought({
              actionThoughtId: launchContext.actionId
          })
        : null

    const navigationHistory = [
        encodeNavigationPath({
            components: targetInterface
                ? [BUILTIN_THOUGHTS_MAP.ACTION_PALETTE.id, targetInterface.id]
                : [BUILTIN_THOUGHTS_MAP.ACTION_PALETTE.id]
        })
    ]

    return <InterfaceRenderer navigationHistory={navigationHistory} />
}

export { ActionPaletteCommand }
