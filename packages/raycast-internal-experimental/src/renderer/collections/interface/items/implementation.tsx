import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import type { ALTEREDInterfaceIconID } from "@altered/core-experimental/icons/definitions"
import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import { Color, Grid, Icon, List } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../../commands/action-palette/interfaces/context"
import { toRaycastIcon } from "../../../../icons"
import type { NavigationPath } from "../../../navigation/definitions"
import { InterfaceOperationsRenderer } from "../../../operations/implementation"
import { COLLECTION_INTERFACE_ITEM_OPERATIONS_DEFINITION } from "./operations/definitions"
import { resolveCollectionItemIconId } from "./utils/resolve-icon-id"
import { resolveCollectionItemSubtitle } from "./utils/resolve-subtitle"
import { resolveCollectionItemTitle } from "./utils/resolve-title"
import { resolveCollectionItemTriggerPhrase } from "./utils/resolve-trigger-phrase"

/**
 * @todo P3: Add support for a grid accessory.
 *
 * @todo P3: Add support for showing details.
 */
function CollectionInterfaceItem({
    navigationHistory,

    thought
}: {
    navigationHistory: NavigationPath[]

    thought: ALTEREDThought
}) {
    const { collectionLayout, isIconVisible, tintColor } =
        useInterfaceRendererContext()

    const Collection = collectionLayout.value === "list" ? List : Grid

    const attributes = useMemo(
        () => getBuiltinAttributes({ query: { ids: thought.attributeIds } }),
        [thought.attributeIds]
    )

    const iconProps = useMemo(() => {
        const iconId = resolveCollectionItemIconId({ attributes })

        const icon = iconId
            ? toRaycastIcon(iconId as ALTEREDInterfaceIconID)
            : null

        const iconProps = {
            source: icon ?? Icon.Cog,
            tintColor,
            tooltip: "[EDIT] Placeholder icon tooltip."
        }

        return iconProps
    }, [attributes, tintColor])

    const title = useMemo(
        () => resolveCollectionItemTitle({ attributes }) ?? thought.alias,
        [thought, attributes]
    )

    const subtitle = useMemo(
        () => resolveCollectionItemSubtitle({ attributes }) ?? thought.content,
        [thought, attributes]
    )

    const accessories = useMemo(() => {
        const triggerPhrase = resolveCollectionItemTriggerPhrase({ attributes })

        const triggerPhraseAccessory = triggerPhrase
            ? {
                  tag: {
                      value: triggerPhrase,
                      color: Color.SecondaryText
                  }
              }
            : null

        const accessories = [triggerPhraseAccessory].filter(
            accessory => accessory !== null
        )

        return accessories
    }, [attributes])

    return (
        <Collection.Item
            accessories={accessories}
            accessory={undefined}
            actions={
                <InterfaceOperationsRenderer
                    navigationHistory={navigationHistory}
                    operations={COLLECTION_INTERFACE_ITEM_OPERATIONS_DEFINITION}
                    thought={thought}
                />
            }
            content={iconProps}
            icon={isIconVisible.value ? iconProps : undefined}
            id={thought.id}
            key={thought.id}
            subtitle={subtitle}
            title={title}
        />
    )
}

export { CollectionInterfaceItem }
