import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { getBuiltinAttributes } from "@altered/core-experimental/data/builtins/access/attributes"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import { resolveThoughtIdsFromDatasetAttribute } from "@altered/core-experimental/data/resolvers/thought-ids-from-dataset-attribute"
import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import { Grid, List } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../../../commands/action-palette/interfaces/context"
import type { InterfaceComponentProps } from "../../../../definitions"
import { CollectionInterfaceItem } from "../implementation"
import { resolveCollectionItemGroupSubtitle } from "./utils/resolve-subtitle"
import { resolveCollectionItemGroupTitle } from "./utils/resolve-title"

function CollectionInterfaceItemGroup({
    navigationHistory,

    groupThought,

    itemThoughts
}: {
    navigationHistory: InterfaceComponentProps["navigationHistory"]

    groupThought: ALTEREDThought

    itemThoughts: ALTEREDThought[]
}) {
    const { collectionLayout } = useInterfaceRendererContext()

    const Collection = collectionLayout.value === "list" ? List : Grid

    const itemGroupProps = useMemo(() => {
        const groupAttributes = getBuiltinAttributes({
            query: { ids: groupThought.attributeIds }
        })

        if (!groupAttributes) {
            console.warn(
                "Collection Interface Item Group: No associated collection item group attributes were found for the collection item group thought.",
                { groupThought }
            )

            return null
        }

        const groupDatasetAttribute = findAttributeBySchemaId(groupAttributes, {
            schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEMS.id
        })

        if (!groupDatasetAttribute) {
            console.warn(
                "Collection Interface Item Group: No associated collection item group dataset attribute was found for the collection item group thought.",
                { groupThought }
            )

            return null
        }

        const groupItemThoughtIds = resolveThoughtIdsFromDatasetAttribute(
            groupDatasetAttribute
        )

        if (!groupItemThoughtIds) {
            console.warn(
                "Collection Interface Item Group: No associated collection item thought IDs were found for the collection item group thought.",
                { groupThought }
            )

            return null
        }

        const groupItemThoughts = itemThoughts.filter(thought =>
            groupItemThoughtIds.includes(thought.id)
        )

        if (!groupItemThoughts.length) {
            console.warn(
                "Collection Interface Item Group: No associated collection item thoughts were found for the collection item group thought.",
                { groupThought }
            )

            return null
        }

        const groupTitle =
            resolveCollectionItemGroupTitle({ groupAttributes }) ??
            groupThought.alias

        const groupSubtitle =
            resolveCollectionItemGroupSubtitle({ groupAttributes }) ??
            groupThought.content

        return {
            groupTitle,
            groupSubtitle,
            groupItemThoughts
        }
    }, [groupThought, itemThoughts])

    if (!itemGroupProps) return null

    const { groupTitle, groupSubtitle, groupItemThoughts } = itemGroupProps

    return (
        <Collection.Section subtitle={groupSubtitle} title={groupTitle}>
            {groupItemThoughts.map(groupItemThought => (
                <CollectionInterfaceItem
                    key={groupItemThought.id}
                    navigationHistory={navigationHistory}
                    thought={groupItemThought}
                />
            ))}
        </Collection.Section>
    )
}

export { CollectionInterfaceItemGroup }
