import { findAttributeBySchemaId } from "@altered/core-experimental/data/attributes/utils/find/by-schema-id"
import { getBuiltinThoughts } from "@altered/core-experimental/data/builtins/access/thoughts"
import { BUILTIN_SCHEMAS_MAP } from "@altered/core-experimental/data/builtins/definitions/schemas"
import { resolveThoughtIdsFromDatasetAttribute } from "@altered/core-experimental/data/resolvers/thought-ids-from-dataset-attribute"
import { Grid, List } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type { InterfaceComponentProps } from "../../definitions"
import { resolveNavigationTitle } from "../../navigation/resolve-title"
import { CollectionInterfaceContent } from "./content"
import {
    COLLECTION_INTERFACE_GRID_LAYOUT_COLUMNS,
    COLLECTION_INTERFACE_GRID_LAYOUT_INSET,
    COLLECTION_INTERFACE_SEARCH_BAR_PLACEHOLDER
} from "./definitions"

function CollectionInterface({
    navigationHistory,

    attributes
}: InterfaceComponentProps) {
    const { collectionLayout } = useInterfaceRendererContext()

    const Collection = useMemo(
        () => (collectionLayout.value === "list" ? List : Grid),
        [collectionLayout]
    )

    const itemGroupThoughts = useMemo(() => {
        const datasetAttribute = findAttributeBySchemaId(attributes, {
            schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEM_GROUPS.id
        })

        const thoughtIds =
            resolveThoughtIdsFromDatasetAttribute(datasetAttribute)

        const thoughts = getBuiltinThoughts({
            query: { ids: thoughtIds }
        })

        return thoughts
    }, [attributes])

    const itemThoughts = useMemo(() => {
        const datasetAttribute = findAttributeBySchemaId(attributes, {
            schemaId: BUILTIN_SCHEMAS_MAP.COLLECTION_INTERFACE_ITEMS.id
        })

        const thoughtIds =
            resolveThoughtIdsFromDatasetAttribute(datasetAttribute)

        const thoughts = getBuiltinThoughts({
            query: { ids: thoughtIds }
        })

        return thoughts
    }, [attributes])

    const navigationTitle = useMemo(
        () => resolveNavigationTitle({ navigationHistory }),
        [navigationHistory]
    )

    return (
        <Collection
            columns={COLLECTION_INTERFACE_GRID_LAYOUT_COLUMNS}
            inset={COLLECTION_INTERFACE_GRID_LAYOUT_INSET}
            navigationTitle={navigationTitle}
            searchBarPlaceholder={COLLECTION_INTERFACE_SEARCH_BAR_PLACEHOLDER}
        >
            <CollectionInterfaceContent
                itemGroupThoughts={itemGroupThoughts}
                itemThoughts={itemThoughts}
                navigationHistory={navigationHistory}
            />
        </Collection>
    )
}

export { CollectionInterface }
