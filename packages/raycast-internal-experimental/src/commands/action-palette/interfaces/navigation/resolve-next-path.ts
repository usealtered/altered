import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { NavigationPath } from "../../../../renderer/navigation/definitions"
import { parseNavigationPath } from "../../../../renderer/navigation/parse-path"
import { resolveCurrentNavigationInterface } from "../../../../renderer/navigation/resolve-current-interface"
import { buildNavigationPathForInterface } from "./paths"

/**
 * Builds the next navigation path only when it is a real child interface of the
 * current path tip — never a self-append or otherwise unresolvable segment.
 */
function resolveNextNavigationPath({
    currentPath,
    targetInterfaceId
}: {
    currentPath: NavigationPath
    targetInterfaceId: ALTEREDThoughtID | null
}): NavigationPath | null {
    if (!targetInterfaceId) return null

    if (parseNavigationPath(currentPath).at(-1) === targetInterfaceId)
        return null

    const nextPath = buildNavigationPathForInterface(
        currentPath,
        targetInterfaceId
    )

    if (!nextPath) return null

    const resolution = resolveCurrentNavigationInterface({
        navigationPath: nextPath
    })

    if (resolution.resolutionType !== "full") return null

    return nextPath
}

export { resolveNextNavigationPath }
