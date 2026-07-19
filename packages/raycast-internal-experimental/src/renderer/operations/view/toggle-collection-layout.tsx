import { Action, Icon } from "@raycast/api"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../definitions"

function ToggleCollectionLayoutOperation(_: InterfaceOperationProps) {
    const { collectionLayout } = useInterfaceRendererContext()

    return (
        <Action
            icon={
                collectionLayout.value === "list"
                    ? Icon.AppWindowGrid2x2
                    : Icon.List
            }
            onAction={collectionLayout.toggle}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "l"
            }}
            title={
                collectionLayout.value === "list"
                    ? "Switch to Grid Layout"
                    : "Switch to List Layout"
            }
        />
    )
}

const TOGGLE_COLLECTION_LAYOUT_OPERATION_DEFINITION = {
    id: "toggle-collection-layout-operation",
    type: "custom-operation",
    component: ToggleCollectionLayoutOperation
} satisfies OperationDefinition

export { TOGGLE_COLLECTION_LAYOUT_OPERATION_DEFINITION }
