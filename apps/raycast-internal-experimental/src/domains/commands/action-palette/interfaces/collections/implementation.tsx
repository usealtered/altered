import { Grid, List } from "@raycast/api"
import { useInterfaceContext } from "../context"
import type { ALTEREDInterfaceItem } from "../definitions"
import { GRID_LAYOUT_COLUMNS, GRID_LAYOUT_INSET } from "./definitions"
import { CollectionInterfaceItem } from "./item"

function CollectionInterface({
    content,
    isGroup
}: {
    content: ALTEREDInterfaceItem[]
    isGroup?: boolean
}) {
    const context = useInterfaceContext()

    const Collection = context.collectionLayout.value === "list" ? List : Grid

    return (
        <Collection
            columns={GRID_LAYOUT_COLUMNS}
            inset={GRID_LAYOUT_INSET}
            searchBarPlaceholder="Search your ALTERED Systems"
        >
            {content.map(item => {
                if (isGroup === true) {
                    const title = item.title ?? item.alias
                    const subtitle = item.subtitle ?? item.content

                    //  Should we consolidate this logic to the renderer? How can we shift our definition schema to be more semantically correct?

                    const rootInterface = item.interfaces?.[0]
                    if (!rootInterface || rootInterface.type !== "collection")
                        return null

                    return (
                        <Collection.Section
                            key={item.id}
                            subtitle={subtitle}
                            title={title}
                        >
                            {rootInterface.content.map(item => (
                                <CollectionInterfaceItem
                                    context={context}
                                    item={item}
                                    key={item.id}
                                />
                            ))}
                        </Collection.Section>
                    )
                }

                return (
                    <CollectionInterfaceItem
                        context={context}
                        item={item}
                        key={item.id}
                    />
                )
            })}
        </Collection>
    )
}

export { CollectionInterface }
