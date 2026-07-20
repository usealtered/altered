import { COPY_DEEPLINK_OPERATION_DEFINITION } from "../../../collections/interface/items/operations/copy-deeplink"
import { INSTALL_SHORTCUT_OPERATION_DEFINITION } from "../../../collections/interface/items/operations/install-shortcut"
import { OPEN_IN_BROWSER_OPERATION_DEFINITION } from "../../../collections/interface/items/operations/open-in-browser"
import { NAVIGATION_OPERATIONS_GROUP_DEFINITION } from "../../../navigation/operations/group"
import type { OperationsDefinition } from "../../../operations/definitions"
import { VIEW_OPERATION_GROUP_DEFINITION } from "../../../operations/view/group"
import { MODIFY_GROUP_OPERATION_DEFINITION } from "./modify/group"

const MARKDOWN_INTERFACE_OPERATIONS_DEFINITION = [
    {
        ...NAVIGATION_OPERATIONS_GROUP_DEFINITION,

        items: [
            ...NAVIGATION_OPERATIONS_GROUP_DEFINITION.items,

            OPEN_IN_BROWSER_OPERATION_DEFINITION,
            COPY_DEEPLINK_OPERATION_DEFINITION,
            INSTALL_SHORTCUT_OPERATION_DEFINITION
        ]
    },

    MODIFY_GROUP_OPERATION_DEFINITION,

    VIEW_OPERATION_GROUP_DEFINITION
] satisfies OperationsDefinition[]

export { MARKDOWN_INTERFACE_OPERATIONS_DEFINITION }
