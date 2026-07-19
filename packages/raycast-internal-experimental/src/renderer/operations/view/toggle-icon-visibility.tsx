import { Action, Icon } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../definitions"

function ToggleIconVisibilityOperation(_: InterfaceOperationProps) {
    const { isIconVisible, tintColor } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: isIconVisible.value ? Icon.EyeDisabled : Icon.Eye,
            tintColor
        }
    }, [isIconVisible, tintColor])

    return (
        <Action
            icon={iconProps}
            onAction={isIconVisible.toggle}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "i"
            }}
            title={isIconVisible.value ? "Hide Icons" : "Show Icons"}
        />
    )
}

const TOGGLE_ICON_VISIBILITY_OPERATION_DEFINITION = {
    id: "toggle-icon-visibility-operation",
    type: "custom-operation",
    component: ToggleIconVisibilityOperation
} satisfies OperationDefinition

export { TOGGLE_ICON_VISIBILITY_OPERATION_DEFINITION }
