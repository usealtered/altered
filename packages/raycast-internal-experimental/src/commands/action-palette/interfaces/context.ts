import type { Color } from "@raycast/api"
import { useCachedState } from "@raycast/utils"
import {
    COLLECTION_LAYOUT_DEFAULT,
    IS_ICON_VISIBLE_DEFAULT,
    TINT_COLOR_DEFAULT
} from "../config"
import { GLOBAL_CACHE_NAMESPACE } from "../definitions"
import type { CollectionLayoutID } from "./collections/definitions"

type InterfaceRendererContext = {
    isIconVisible: {
        value: boolean
        toggle: () => void
    }

    tintColor: Color

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
function useInterfaceRendererContext(): InterfaceRendererContext {
    const [isIconVisible, setIsIconVisible] = useCachedState(
        "is-icon-visible",
        IS_ICON_VISIBLE_DEFAULT,
        { cacheNamespace: GLOBAL_CACHE_NAMESPACE }
    )

    const [collectionLayout, setCollectionLayout] =
        useCachedState<CollectionLayoutID>(
            "collection-layout",
            COLLECTION_LAYOUT_DEFAULT,
            { cacheNamespace: GLOBAL_CACHE_NAMESPACE }
        )

    return {
        isIconVisible: {
            value: isIconVisible,
            toggle: () => setIsIconVisible(value => !value)
        },

        tintColor: TINT_COLOR_DEFAULT,

        collectionLayout: {
            value: collectionLayout,
            toggle: () =>
                setCollectionLayout(value =>
                    value === "list" ? "grid" : "list"
                )
        }
    }
}

export { type InterfaceRendererContext, useInterfaceRendererContext }
