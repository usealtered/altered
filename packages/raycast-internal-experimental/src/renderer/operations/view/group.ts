import type { OperationGroupDefinition } from "../definitions"
import { TOGGLE_COLLECTION_LAYOUT_OPERATION_DEFINITION } from "./toggle-collection-layout"
import { TOGGLE_ICON_VISIBILITY_OPERATION_DEFINITION } from "./toggle-icon-visibility"

const VIEW_OPERATION_GROUP_DEFINITION = {
    id: "view-operation-group",
    type: "operation-group",
    title: "View",
    items: [
        TOGGLE_ICON_VISIBILITY_OPERATION_DEFINITION,
        TOGGLE_COLLECTION_LAYOUT_OPERATION_DEFINITION
    ]
} satisfies OperationGroupDefinition

export { VIEW_OPERATION_GROUP_DEFINITION }
