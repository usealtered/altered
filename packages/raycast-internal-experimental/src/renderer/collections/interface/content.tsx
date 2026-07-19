import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import { Grid, List } from "@raycast/api"
import { useMemo } from "react"
import { useInterfaceRendererContext } from "../../../commands/action-palette/interfaces/context"
import type { InterfaceComponentProps } from "../../definitions"
import { CollectionInterfaceItemGroup } from "./items/groups/implementation"
import { CollectionInterfaceItem } from "./items/implementation"

/**
 * @todo P3: Customize and create a serialization adapter for the `EmptyView` component.
 */
function CollectionInterfaceContent({
    navigationHistory,

    itemGroupThoughts,
    itemThoughts
}: {
    navigationHistory: InterfaceComponentProps["navigationHistory"]

    itemGroupThoughts: ALTEREDThought[] | null
    itemThoughts: ALTEREDThought[] | null
}) {
    const { collectionLayout } = useInterfaceRendererContext()

    const Collection = useMemo(
        () => (collectionLayout.value === "list" ? List : Grid),
        [collectionLayout]
    )

    if (!itemThoughts) {
        return (
            <Collection.EmptyView
                actions={undefined}
                description={undefined}
                icon={undefined}
                title={undefined}
            />
        )
    }

    if (!itemGroupThoughts) {
        return itemThoughts.map(itemThought => (
            <CollectionInterfaceItem
                key={itemThought.id}
                navigationHistory={navigationHistory}
                thought={itemThought}
            />
        ))
    }

    return itemGroupThoughts.map(groupThought => (
        <CollectionInterfaceItemGroup
            groupThought={groupThought}
            itemThoughts={itemThoughts}
            key={groupThought.id}
            navigationHistory={navigationHistory}
        />
    ))
}

export { CollectionInterfaceContent }
