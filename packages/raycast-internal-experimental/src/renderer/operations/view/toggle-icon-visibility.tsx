import { Action, Icon } from "@raycast/api"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../definitions"

function ToggleIconVisibilityOperation(_: InterfaceOperationProps) {
    const { isIconVisible } = useInterfaceRendererContext()

    return (
        <Action
            icon={isIconVisible.value ? Icon.EyeDisabled : Icon.Eye}
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
