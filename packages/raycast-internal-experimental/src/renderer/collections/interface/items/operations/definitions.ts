import { NAVIGATION_OPERATIONS_GROUP_DEFINITION } from "../../../../navigation/operations/group"
import type { OperationsDefinition } from "../../../../operations/definitions"
import { VIEW_OPERATION_GROUP_DEFINITION } from "../../../../operations/view/group"
import { COPY_DEEPLINK_OPERATION_DEFINITION } from "./copy-deeplink"
import { INSTALL_SHORTCUT_OPERATION_DEFINITION } from "./install-shortcut"
import { OPEN_IN_BROWSER_OPERATION_DEFINITION } from "./open-in-browser"

const COLLECTION_INTERFACE_ITEM_OPERATIONS_DEFINITION = [
    {
        ...NAVIGATION_OPERATIONS_GROUP_DEFINITION,

        items: [
            ...NAVIGATION_OPERATIONS_GROUP_DEFINITION.items,

            OPEN_IN_BROWSER_OPERATION_DEFINITION,
            COPY_DEEPLINK_OPERATION_DEFINITION,
            INSTALL_SHORTCUT_OPERATION_DEFINITION
        ]
    },

    VIEW_OPERATION_GROUP_DEFINITION
] satisfies OperationsDefinition[]

export { COLLECTION_INTERFACE_ITEM_OPERATIONS_DEFINITION }
