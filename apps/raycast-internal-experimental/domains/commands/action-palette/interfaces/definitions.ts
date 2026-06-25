import { Icon } from "@raycast/api"

/**
 * @todo P3: Refine the icon set and mappings further.
 */
type ALTEREDInterfaceIcon = `${Icon}`

function toRaycastIcon(id: ALTEREDInterfaceIcon): Icon | null {
    const raycastIcons = Object.values(Icon) as string[]

    return raycastIcons.includes(id) ? (id as Icon) : null
}

type ALTEREDInterfaceItem = {
    id: string

    alias: string
    content: string

    title?: string
    subtitle?: string

    icon?: ALTEREDInterfaceIcon

    /**
     * @todo P3: We could consider renaming this to something closer to "chord" or "alias".
     */
    triggerPhrase?: string

    interfaces?: ALTEREDInterface[]
}

type ALTEREDInterface =
    | {
          type: "markdown"
          content: string
      }
    | {
          /**
           * Represents a grid or a list.
           */
          type: "collection"
          content: ALTEREDInterfaceItem[]
      }
    | {
          /**
           * @remarks Must only contain `collection` interfaces.
           */
          type: "collection-groups"
          content: ALTEREDInterfaceItem[]
      }

export {
    type ALTEREDInterface,
    type ALTEREDInterfaceIcon,
    type ALTEREDInterfaceItem,
    toRaycastIcon
}
