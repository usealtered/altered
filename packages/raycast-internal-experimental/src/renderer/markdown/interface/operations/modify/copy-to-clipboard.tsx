import { Action, Clipboard, Icon, showToast, Toast } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

function CopyToClipboardOperation({ thought }: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.Clipboard,
            tintColor
        }
    }, [isIconVisible, tintColor])

    if (!thought) return null

    return (
        <Action
            icon={iconProps}
            onAction={async () => {
                await Clipboard.copy(thought.content)

                await showToast({
                    title: "Copied to Clipboard",
                    message: `Successfully copied the content of '${thought.alias}' to clipboard.`,
                    style: Toast.Style.Success
                })
            }}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
            title="Copy to Clipboard"
        />
    )
}

const COPY_TO_CLIPBOARD_OPERATION_DEFINITION = {
    id: "copy-to-clipboard-operation",
    type: "custom-operation",
    component: CopyToClipboardOperation
} satisfies OperationDefinition

export { COPY_TO_CLIPBOARD_OPERATION_DEFINITION }
