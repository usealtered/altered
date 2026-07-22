import type { ALTEREDThoughtID } from "@altered/core-experimental/models/thoughts/definitions"
import { showToast, Toast, useNavigation } from "@raycast/api"
import { useCallback, useMemo } from "react"
import { resolveNextNavigationPath } from "../../commands/action-palette/interfaces/navigation/resolve-next-path"
import { resolveCollectionItemInterfaceThought } from "../../data/resolvers/collection-item-interface-thought"
import { InterfaceRenderer } from "../implementation"
import type { NavigationPath } from "./definitions"
import { encodeNavigationPath } from "./encode-path"

function useInterfaceRendererNavigation({
    navigationHistory
}: {
    navigationHistory: NavigationPath[]
}) {
    const { push: pushRaycast, pop: popRaycast } = useNavigation()

    const currentNavigationPath = useMemo(
        () => navigationHistory.at(-1),
        [navigationHistory]
    )

    const push = useCallback(
        ({ interfaceId }: { interfaceId: ALTEREDThoughtID }) => {
            // resolve interface to colleciton item...
            const targetInterface = resolveCollectionItemInterfaceThought({
                collectionItemThoughtId: interfaceId
            })

            const nextNavigationPath =
                currentNavigationPath && targetInterface
                    ? resolveNextNavigationPath({
                          currentPath: currentNavigationPath,
                          targetInterfaceId: targetInterface?.id ?? null
                      })
                    : null

            if (targetInterface) {
                pushRaycast(
                    <InterfaceRenderer
                        navigationHistory={[
                            encodeNavigationPath({
                                components: [targetInterface.id]
                            })
                        ]}
                    />
                )

                return
            }

            if (!nextNavigationPath) {
                void showToast({
                    title: "No Interface Found",
                    message:
                        "The item does not expose a navigable child interface.",
                    style: Toast.Style.Failure
                })

                return
            }

            pushRaycast(
                <InterfaceRenderer
                    navigationHistory={[
                        ...navigationHistory,
                        nextNavigationPath
                    ]}
                />
            )
        },
        [currentNavigationPath, navigationHistory, pushRaycast]
    )

    return {
        push,

        pop: popRaycast
    }
}

export { useInterfaceRendererNavigation }
