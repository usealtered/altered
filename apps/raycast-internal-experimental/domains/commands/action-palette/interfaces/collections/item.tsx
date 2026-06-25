import { Color, Grid, Icon, List } from "@raycast/api"
import { GlobalActions } from "../../global-actions"
import type { InterfaceContext } from "../context"
import { type ALTEREDInterfaceItem, toRaycastIcon } from "../definitions"

function CollectionInterfaceItem({
    item,
    context
}: {
    item: ALTEREDInterfaceItem
    context: InterfaceContext
}) {
    const CollectionItem =
        context.collectionLayout.value === "list" ? List.Item : Grid.Item

    const icon = (item.icon ? toRaycastIcon(item.icon) : null) ?? Icon.Cog

    const iconProps = {
        source: icon,
        tintColor: Color.SecondaryText,
        tooltip: "Placeholder tooltip."
    }

    const triggerPhraseAccessory = {
        tag: {
            value: item.triggerPhrase,
            color: Color.SecondaryText
        }
    }

    return (
        <CollectionItem
            accessories={
                triggerPhraseAccessory ? [triggerPhraseAccessory] : undefined
            }
            actions={<GlobalActions context={context} item={item} />}
            content={iconProps}
            icon={context.isIconVisible.value ? iconProps : undefined}
            id={item.id}
            key={item.id}
            subtitle={item.content}
            title={item.alias}
        />
    )
}

export { CollectionInterfaceItem }
