// import type { ReactNode } from "react"

// type InterfaceID = string

// const INTERFACE_TYPE_MAP = {
//     COLLECTION: "collection",
//     FORM: "form",
//     MARKDOWN: "markdown",
//     CUSTOM: "custom"
// } as const

// const INTERFACE_TYPES = Object.values(INTERFACE_TYPE_MAP)

// type InterfaceType =
//     (typeof INTERFACE_TYPE_MAP)[keyof typeof INTERFACE_TYPE_MAP]

// type InterfaceBase = {
//     id: InterfaceID

//     alias: string
//     content: string
// }

// type FormField =
//     | {
//           id: string

//           type: "text-field"

//           title: string
//           placeholder?: string
//       }
//     | {
//           id: string

//           type: "text-area"

//           title: string
//           placeholder?: string
//       }
//     | {
//           id: string

//           type: "checkbox"

//           title: string
//           label: string
//           //   defaultValue?: boolean
//       }

// type CollectionInterface = InterfaceBase & {
//     type: typeof INTERFACE_TYPE_MAP.COLLECTION

//     itemIds: string[]
//     groupIds?: string[]
// }

// type FormInterface = InterfaceBase & {
//     type: typeof INTERFACE_TYPE_MAP.FORM

//     fields: FormField[]
// }

// type MarkdownInterface = InterfaceBase & {
//     type: typeof INTERFACE_TYPE_MAP.MARKDOWN
// }

// type CustomInterface = InterfaceBase & {
//     type: typeof INTERFACE_TYPE_MAP.CUSTOM

//     componentId: string
// }

// type ALTEREDInterface =
//     | CollectionInterface
//     | FormInterface
//     | MarkdownInterface
//     | CustomInterface

// type CustomInterfaceRenderer = () => ReactNode

// export {
//     type ALTEREDInterface,
//     type CollectionInterface,
//     type CustomInterface,
//     type CustomInterfaceRenderer,
//     type FormField,
//     type FormInterface,
//     INTERFACE_TYPE_MAP,
//     INTERFACE_TYPES,
//     type InterfaceBase,
//     type InterfaceID,
//     type InterfaceType,
//     type MarkdownInterface
// }
