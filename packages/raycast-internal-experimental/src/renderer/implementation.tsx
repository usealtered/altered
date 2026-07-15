import { showToast, Toast, useNavigation } from "@raycast/api"
import { useEffect, useMemo } from "react"
import { resolveCurrentNavigationInterface } from "../commands/action-palette/interfaces/navigation/paths"
import { INTERFACE_COMPONENT_MAP } from "./definitions"
import type { NavigationPath } from "./navigation/definitions"
import { resolveInterfaceType } from "./resolvers/interface-type"

/**
 * @todo P2: Implement support for `navigationStyle: "full" | "direct"` (or similar) for optional deeplink history expansion. See [Cursor chat](file:///Users/inducingchaos/.cursor/projects/Users-inducingchaos-Workspace-containers-altered/agent-transcripts/d13781eb-7f15-47fd-9962-23c433f8e0cf/d13781eb-7f15-47fd-9962-23c433f8e0cf.jsonl).
 */
function InterfaceRenderer({
    navigationHistory
}: {
    navigationHistory: NavigationPath[]
}) {
    const { pop } = useNavigation()

    const currentNavigationPath = useMemo(
        () => navigationHistory.at(-1),
        [navigationHistory]
    )

    if (!currentNavigationPath)
        throw new Error(
            "Interface Rendering Failed: Navigation history is empty. This should never happen.",
            { cause: { navigationHistory } }
        )

    const {
        status: pathResolutionStatus,
        navigationPath: resolvedNavigationPath,
        thought,
        attributes
    } = useMemo(
        () =>
            resolveCurrentNavigationInterface({
                navigationPath: currentNavigationPath
            }),
        [currentNavigationPath]
    )

    const interfaceTypeId = useMemo(
        () => resolveInterfaceType({ attributes }),
        [attributes]
    )

    useEffect(() => {
        if (pathResolutionStatus === "partial") {
            const errorTitle = "Navigation Path Unresolvable"
            const errorDescription = `The interface at '${currentNavigationPath}' could not be resolved, navigated to '${resolvedNavigationPath}' instead.`

            console.error(`${errorTitle}: ${errorDescription}`)

            void showToast({
                style: Toast.Style.Failure,
                title: errorTitle,
                message: errorDescription
            })
        }

        if (!interfaceTypeId) {
            const errorTitle = "Unsupported Interface Type ID"
            const errorDescription = `The interface at '${currentNavigationPath}' has no resolvable interface type ID.`

            console.error(`${errorTitle}: ${errorDescription}`, {
                cause: { navigationPath: currentNavigationPath }
            })

            void showToast({
                style: Toast.Style.Failure,
                title: errorTitle,
                message: errorDescription
            })

            pop()
        }
    }, [
        currentNavigationPath,
        resolvedNavigationPath,
        pathResolutionStatus,
        interfaceTypeId,
        pop
    ])

    const InterfaceComponent = useMemo(
        () =>
            interfaceTypeId ? INTERFACE_COMPONENT_MAP[interfaceTypeId] : null,
        [interfaceTypeId]
    )

    return InterfaceComponent ? (
        <InterfaceComponent
            attributes={attributes}
            navigationHistory={navigationHistory}
            thought={thought}
        />
    ) : null
}

export { InterfaceRenderer }
