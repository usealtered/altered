import type { ALTEREDInterfaceIconID } from "@altered/core-experimental/icons/definitions"
import { Icon } from "@raycast/api"

function toRaycastIcon(id: ALTEREDInterfaceIconID): Icon | null {
    const raycastIconIds = Object.values(Icon) as string[]

    return raycastIconIds.includes(id) ? (id as Icon) : null
}

export { toRaycastIcon }
