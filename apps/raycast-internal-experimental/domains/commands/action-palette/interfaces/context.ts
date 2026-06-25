import { useCachedState } from "@raycast/utils"
import { COLLECTION_LAYOUT_DEFAULT, IS_ICON_VISIBLE_DEFAULT } from "../config"
import type { CollectionLayoutID } from "./collections/definitions"

/**
 * @remarks Demo context. Subject to change.
 */
type InterfaceContext = {
    isIconVisible: {
        value: boolean
        toggle: () => void
    }

    collectionLayout: {
        value: CollectionLayoutID
        toggle: () => void
    }
}

/**
 * @todo P2: Explore `useSyncExternalStore` as a more durable context solution - see chat.
 *
 * @remarks We can't use `useContext` or prop-drilling through nested interfaces because each pushed entry in the Raycast navigation stack acts as an isolated instance.
 */
function useInterfaceContext(): InterfaceContext {
    const cacheNamespace = "action-palette"

    const [isIconVisible, setIsIconVisible] = useCachedState(
        "is-icon-visible",
        IS_ICON_VISIBLE_DEFAULT,
        { cacheNamespace }
    )

    const [collectionLayout, setCollectionLayout] =
        useCachedState<CollectionLayoutID>(
            "collection-layout",
            COLLECTION_LAYOUT_DEFAULT,
            { cacheNamespace }
        )

    return {
        isIconVisible: {
            value: isIconVisible,
            toggle: () => setIsIconVisible(value => !value)
        },

        collectionLayout: {
            value: collectionLayout,
            toggle: () =>
                setCollectionLayout(value =>
                    value === "list" ? "grid" : "list"
                )
        }
    }
}

export { type InterfaceContext, useInterfaceContext }
