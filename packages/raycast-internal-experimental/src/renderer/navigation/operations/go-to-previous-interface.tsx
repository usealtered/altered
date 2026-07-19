import { Action, Icon } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../operations/definitions"
import { useInterfaceRendererNavigation } from "../use"

function GoToPreviousInterfaceOperation({
    navigationHistory
}: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const { pop } = useInterfaceRendererNavigation({ navigationHistory })

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.ArrowLeftCircleFilled,
            tintColor
        }
    }, [isIconVisible, tintColor])

    return (
        <Action
            icon={iconProps}
            onAction={pop}
            shortcut={{ modifiers: ["cmd"], key: "arrowLeft" }}
            title="Go To Previous Interface"
        />
    )
}

const GO_TO_PREVIOUS_INTERFACE_OPERATION_DEFINITION = {
    id: "go-to-previous-interface-operation",
    type: "custom-operation",
    component: GoToPreviousInterfaceOperation
} satisfies OperationDefinition

export { GO_TO_PREVIOUS_INTERFACE_OPERATION_DEFINITION }
