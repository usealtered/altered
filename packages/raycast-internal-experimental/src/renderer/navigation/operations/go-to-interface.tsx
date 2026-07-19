import { Action, Icon } from "@raycast/api"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../operations/definitions"
import { useInterfaceRendererNavigation } from "../use"

function GoToInterfaceOperation({
    navigationHistory,

    thought
}: InterfaceOperationProps) {
    const { push } = useInterfaceRendererNavigation({ navigationHistory })

    return (
        <Action
            icon={Icon.ArrowRightCircle}
            onAction={() => push({ interfaceId: thought.id })}
            shortcut={{ modifiers: ["cmd"], key: "arrowRight" }}
            title="Go To Interface"
        />
    )
}

const GO_TO_INTERFACE_OPERATION_DEFINITION = {
    id: "go-to-interface-operation",
    type: "custom-operation",
    component: GoToInterfaceOperation
} satisfies OperationDefinition

export { GO_TO_INTERFACE_OPERATION_DEFINITION }
