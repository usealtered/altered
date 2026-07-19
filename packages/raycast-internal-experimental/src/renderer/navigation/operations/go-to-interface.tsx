import { Action, Icon } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../operations/definitions"
import { useInterfaceRendererNavigation } from "../use"

function GoToInterfaceOperation({
    navigationHistory,

    thought
}: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const { push } = useInterfaceRendererNavigation({ navigationHistory })

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.ArrowRightCircle,
            tintColor
        }
    }, [isIconVisible, tintColor])

    return (
        <Action
            icon={iconProps}
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
