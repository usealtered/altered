import {
    Action,
    Clipboard,
    Icon,
    LaunchType,
    showToast,
    Toast
} from "@raycast/api"
import { createDeeplink, DeeplinkType } from "@raycast/utils"
import { useMemo } from "react"
import { ACTION_PALETTE_COMMAND_NAME } from "../../../../../commands/action-palette/definitions"
import { useInterfaceRendererContext } from "../../../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

function CopyDeeplinkOperation({ thought }: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.Link,
            tintColor
        }
    }, [isIconVisible, tintColor])

    if (!thought) return null

    return (
        <Action
            icon={iconProps}
            onAction={async () => {
                const url = createDeeplink({
                    command: ACTION_PALETTE_COMMAND_NAME,

                    type: DeeplinkType.Extension,
                    launchType: LaunchType.UserInitiated,

                    context: { actionId: thought.id }
                })

                await Clipboard.copy(url)

                await showToast({
                    title: "Deeplink Copied",
                    message: `Successfully copied the deeplink for '${thought.alias}' to clipboard.`,
                    style: Toast.Style.Success
                })
            }}
            shortcut={{ modifiers: ["cmd", "shift"], key: "l" }}
            title="Copy Deeplink"
        />
    )
}

const COPY_DEEPLINK_OPERATION_DEFINITION = {
    id: "copy-deeplink-operation",
    type: "custom-operation",
    component: CopyDeeplinkOperation
} satisfies OperationDefinition

export { COPY_DEEPLINK_OPERATION_DEFINITION }
