import { getBuiltinThoughts } from "@altered/core-experimental/data/builtins/access/thoughts"
import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { NavigationPath } from "./definitions"
import { parseNavigationPath } from "./parse-path"

const DEFAULT_NAVIGATION_TITLE = "ALTERED"
const NAVIGATION_TITLE_SEPARATOR = " > "

function resolveNavigationTitle({ history }: { history: NavigationPath[] }) {
    const currentNavigationPath = history.at(-1)
    if (!currentNavigationPath) return DEFAULT_NAVIGATION_TITLE

    const pathComponents = parseNavigationPath(currentNavigationPath)

    const interfaces = getBuiltinThoughts({
        query: { ids: pathComponents as ALTEREDThoughtID[] }
    })
    if (!interfaces) return DEFAULT_NAVIGATION_TITLE

    return interfaces.reduce(
        (acc, _interface) =>
            acc.length
                ? `${acc}${NAVIGATION_TITLE_SEPARATOR}${_interface.alias}`
                : _interface.alias,
        ""
    )
}

export { resolveNavigationTitle }
