import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { getBuiltinThought } from "@altered/core-experimental/data/builtins/access/thoughts"
import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"
import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import { isChildOfCollectionInterface } from "../resolvers/is-child-of-collection-interface"
import { isInterfaceThoughtId } from "../resolvers/is-interface-thought-id"
import type { NavigationPath } from "./definitions"
import { encodeNavigationPath } from "./encode-path"
import { parseNavigationPath } from "./parse-path"

function resolveCurrentNavigationInterface({
    navigationPath
}: {
    navigationPath: NavigationPath
}): {
    resolutionType: "partial" | "full"

    navigationPath: NavigationPath

    thought: ALTEREDThought
    attributes: ALTEREDAttribute[]
} {
    const pathComponents = parseNavigationPath(navigationPath)

    /**
     * @todo P3: We could probably deduplicate and consolidate some of these checks. Either do each check inline (tedious, unclear), create clear separation boundaries for each entity type, and/or allow passing flags to skip completed checks. This may be over-engineered, but we could return a `meta` property that contains UIDs for each type of check performed. Or, for something like `isInterfaceThoughtId`, a `didCheckThought` boolean, or a way to pass in already-fetched attributes to validate. Not the biggest deal to re-fetch and re-check if data is cached, but using a different API path would bypass the potential savings.
     */
    const interfaceQueryResults = pathComponents.map(interfaceId => {
        try {
            const thought = getBuiltinThought({ query: { id: interfaceId } })

            if (!thought)
                throw new Error(
                    "Navigation Interface Resolution Failed: Interface thought not found.",
                    { cause: { interfaceId } }
                )

            if (!isInterfaceThoughtId(interfaceId))
                throw new Error(
                    "Navigation Interface Resolution Failed: Thought is not an interface.",
                    { cause: { interfaceId } }
                )

            const attributes = getBuiltinAttributes({
                query: { ids: thought.attributeIds }
            })

            if (!attributes)
                throw new Error(
                    "Navigation Interface Resolution Failed: Attributes not found.",
                    { cause: { interfaceId } }
                )

            return {
                status: "fulfilled" as const,
                value: { thought, attributes }
            }
        } catch (reason) {
            return { status: "rejected" as const, reason }
        }
    })

    const navigationInterfaces: {
        thought: ALTEREDThought
        attributes: ALTEREDAttribute[]
    }[] = []

    for (const interfaceQueryResult of interfaceQueryResults) {
        if (interfaceQueryResult.status === "rejected") {
            console.error(interfaceQueryResult.reason)

            break
        }

        const previousInterface = navigationInterfaces.at(-1)

        if (
            previousInterface &&
            !isChildOfCollectionInterface({
                collectionAttributes: previousInterface.attributes,
                childInterfaceId: interfaceQueryResult.value.thought.id
            })
        ) {
            console.error(
                "Navigation Path Resolution Failed: Thought is not a child interface of the previous collection interface.",
                {
                    cause: {
                        previousInterfaceId: previousInterface.thought.id,
                        currentInterfaceId:
                            interfaceQueryResult.value.thought.id
                    }
                }
            )

            break
        }

        navigationInterfaces.push(interfaceQueryResult.value)
    }

    const resolvedNavigationPath = encodeNavigationPath({
        components: navigationInterfaces.map(item => item.thought.id)
    })

    const currentNavigationInterface = navigationInterfaces.at(-1)
    if (!currentNavigationInterface) {
        throw new Error(
            "Navigation Interface Resolution Failed: Root navigation interface not found.",
            {
                cause: { path: navigationPath }
            }
        )
    }

    return {
        resolutionType:
            resolvedNavigationPath === navigationPath ? "full" : "partial",

        navigationPath: resolvedNavigationPath,

        thought: currentNavigationInterface.thought,
        attributes: currentNavigationInterface.attributes
    }
}

export { resolveCurrentNavigationInterface }
