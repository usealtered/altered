import {
    Action,
    Clipboard,
    Icon,
    LaunchType,
    showToast,
    Toast
} from "@raycast/api"
import { createDeeplink, DeeplinkType } from "@raycast/utils"
import { ACTION_PALETTE_COMMAND_NAME } from "../../../../../commands/action-palette/definitions"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

function CopyDeeplinkOperation({ thought }: InterfaceOperationProps) {
    if (!thought) return null

    return (
        <Action
            icon={Icon.Link}
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
