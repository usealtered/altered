import { Action, closeMainWindow, Icon, PopToRootType } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../operations/definitions"

function CloseInterfaceOperation(_: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.XMarkCircle,
            tintColor
        }
    }, [isIconVisible, tintColor])

    return (
        <Action
            icon={iconProps}
            onAction={() =>
                closeMainWindow({
                    clearRootSearch: true,
                    popToRootType: PopToRootType.Immediate
                })
            }
            shortcut={{ modifiers: ["cmd"], key: "w" }}
            title="Close Interface"
        />
    )
}

const CLOSE_INTERFACE_OPERATION_DEFINITION = {
    id: "close-interface-operation",
    type: "custom-operation",
    component: CloseInterfaceOperation
} satisfies OperationDefinition

export { CLOSE_INTERFACE_OPERATION_DEFINITION }
