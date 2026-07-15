import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { NavigationPath } from "./definitions"

function parseNavigationPath(path: NavigationPath): ALTEREDThoughtID[] {
    return path.split("/").filter(Boolean) as ALTEREDThoughtID[]
}

export { parseNavigationPath }
