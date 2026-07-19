import { Action, Icon } from "@raycast/api"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../operations/definitions"
import { useInterfaceRendererNavigation } from "../use"

function GoToPreviousInterfaceOperation({
    navigationHistory
}: InterfaceOperationProps) {
    const { pop } = useInterfaceRendererNavigation({ navigationHistory })

    return (
        <Action
            icon={Icon.ArrowLeftCircleFilled}
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
