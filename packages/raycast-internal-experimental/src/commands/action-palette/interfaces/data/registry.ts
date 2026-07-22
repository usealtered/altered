// import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
// import { SetUpShortcutsInterface } from "../../../../shortcuts/setup/interface/implementation"
// import type {
//     CollectionInterface,
//     CustomInterfaceRenderer,
//     Interface
// } from "../types/interface"
// import type { CollectionItemThought } from "../types/thought"
// import { collectionGroupThoughts } from "./collection-group-thoughts"
// import { collectionItemThoughts } from "./collection-item-thoughts"
// import { interfaces as detachedInterfaces } from "./interfaces"

// const interfaces = [
//     actionPaletteInterface,
//     ...detachedInterfaces
// ] as const satisfies readonly Interface[]

// const customInterfaceRenderers = {
//     "set-up-shortcuts": SetUpShortcutsInterface
// } satisfies Record<string, CustomInterfaceRenderer>

// function getCollectionItemThought(
//     id: string
// ): CollectionItemThought | undefined {
//     const local = collectionItemThoughts.find(item => item.id === id)

//     if (local) return local

//     //  @todo P2: Fetch collection item thought from network when absent locally.

//     return
// }

// function getCollectionGroupThought(id: string) {
//     const local = collectionGroupThoughts.find(group => group.id === id)

//     if (local) return local

//     //  @todo P2: Fetch collection group thought from network when absent locally.

//     return
// }

// async function getInterface({
//     query
// }: {
//     query: { id?: string }
// }): Promise<Interface | null> {
//     if (!query.id) return null

//     const local = interfaces.find(
//         interfaceThought => interfaceThought.id === query.id
//     )

//     if (local) return local

//     //  @todo P2: Fetch interface from network when absent locally.

//     await new Promise(resolve => setTimeout(resolve, 1500))

//     return null
// }

// function getCustomInterfaceRenderer(componentId: string) {
//     return customInterfaceRenderers[
//         componentId as keyof typeof customInterfaceRenderers
//     ]
// }

// function getActionThoughtById(id: string) {
//     const thought = getCollectionItemThought(id)

//     const action = {
//         ...thought,
//         attributes: [
//             {
//                 id: "mock-attribute-interface-id",
//                 alias: "Interface ID",
//                 content: "The interface ID of the action.",

//                 value: thought?.interfaceId
//             }
//         ]
//     }

//     return action as typeof action | null
// }

// function assertValidCollectionInterface(interfaceThought: CollectionInterface) {
//     if (!interfaceThought.groupIds?.length) return

//     const contentIds = new Set(interfaceThought.itemIds)

//     for (const groupId of interfaceThought.groupIds) {
//         const group = getCollectionGroupThought(groupId)

//         if (!group)
//             throw new Error(
//                 `Collection group "${groupId}" is not registered for interface "${interfaceThought.id}".`
//             )

//         for (const itemId of group.itemIds)
//             if (!contentIds.has(itemId))
//                 throw new Error(
//                     `Collection group "${groupId}" references unknown item "${itemId}" on interface "${interfaceThought.id}".`
//                 )

//         if (group.itemIds.length !== interfaceThought.itemIds.length)
//             throw new Error(
//                 `Collection group "${groupId}" itemIds must match interface content on "${interfaceThought.id}".`
//             )
//     }
// }

// // assertValidCollectionInterface(actionPaletteInterface)

// export {
//     getActionThoughtById,
//     getCollectionGroupThought,
//     getCollectionItemThought,
//     getCustomInterfaceRenderer,
//     getInterface,
//     interfaces
// }
