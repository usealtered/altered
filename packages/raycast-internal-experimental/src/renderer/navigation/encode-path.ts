import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import type { NavigationPath } from "./definitions"

function encodeNavigationPath({
    components
}: {
    components: ALTEREDThoughtID[]
}) {
    return `/${components.join("/")}` as NavigationPath
}

export { encodeNavigationPath }
