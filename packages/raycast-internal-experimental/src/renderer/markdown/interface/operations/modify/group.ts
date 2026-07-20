import type { OperationGroupDefinition } from "../../../../operations/definitions"
import { COPY_TO_CLIPBOARD_OPERATION_DEFINITION } from "./copy-to-clipboard"

const MODIFY_GROUP_OPERATION_DEFINITION = {
    id: "modify-group-operation",
    type: "operation-group",
    title: "Modify",
    items: [COPY_TO_CLIPBOARD_OPERATION_DEFINITION]
} satisfies OperationGroupDefinition

export { MODIFY_GROUP_OPERATION_DEFINITION }
