import type { OperationGroupDefinition } from "../../operations/definitions"
import { GO_TO_INTERFACE_OPERATION_DEFINITION } from "./go-to-interface"
import { GO_TO_PREVIOUS_INTERFACE_OPERATION_DEFINITION } from "./go-to-previous-interface"

const NAVIGATION_OPERATIONS_GROUP_DEFINITION = {
    id: "navigation-operations-group",
    type: "operation-group",
    title: "Navigation",
    items: [
        GO_TO_INTERFACE_OPERATION_DEFINITION,
        GO_TO_PREVIOUS_INTERFACE_OPERATION_DEFINITION
    ]
} satisfies OperationGroupDefinition

export { NAVIGATION_OPERATIONS_GROUP_DEFINITION }
