import { Grid, List } from "@raycast/api"
import { useInterfaceContext } from "../context"
import type { ALTEREDInterfaceItem } from "../definitions"
import { GRID_LAYOUT_COLUMNS, GRID_LAYOUT_INSET } from "./definitions"
import { CollectionInterfaceItem } from "./item"

function CollectionInterface({ content }: { content: ALTEREDInterfaceItem[] }) {
    const context = useInterfaceContext()

    const Collection = context.collectionLayout.value === "list" ? List : Grid

    return (
        <Collection columns={GRID_LAYOUT_COLUMNS} inset={GRID_LAYOUT_INSET}>
            {content.map(item => (
                <CollectionInterfaceItem
                    context={context}
                    item={item}
                    key={item.id}
                />
            ))}
        </Collection>
    )
}

export { CollectionInterface }
