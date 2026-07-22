// import type {
//     CollectionInterface,
//     CustomInterface,
//     FormInterface,
//     Interface,
//     MarkdownInterface
// } from "../types/interface"
// import {
//     distillMessageToolPocItem,
//     queryMemoryToolPocItem
// } from "./collection-item-thoughts"

// const ACTION_PALETTE_INTERFACE_ID = "action-palette"

// const captureThoughtInterface = {
//     id: "mock-interface-capture-thought",

//     alias: "Capture Thought",
//     content: "Capture a thought to your ALTERED Brain.",
//     type: "form",

//     fields: [
//         {
//             id: "title",

//             type: "text-field",

//             title: "Title",
//             placeholder: "Optional title..."
//         },

//         {
//             id: "content",

//             type: "text-area",

//             title: "Content",
//             placeholder: "Type a thought..."
//         },

//         {
//             id: "draft",

//             type: "checkbox",

//             title: "Draft",
//             label: "Save as draft"
//         }
//     ]
// } satisfies FormInterface

// const configureShortcutsInterface = {
//     id: "mock-interface-configure-shortcuts",

//     alias: "Configure Shortcuts",
//     content:
//         "Instructions for configuring the ALTERED Script Commands directory.",
//     type: "custom",

//     componentId: "set-up-shortcuts"
// } satisfies CustomInterface

// const alteredOnboardingInterface = {
//     id: "mock-interface-altered-onboarding",

//     alias: "ALTERED Onboarding",
//     content: "# ALTERED Onboarding\n\nNot implemented.",
//     type: "markdown"
// } satisfies MarkdownInterface

// const viewThoughtsInterface = {
//     id: "mock-interface-view-thoughts",

//     alias: "View Thoughts",
//     content: "View and manage the thoughts in your ALTERED Brain.",
//     type: "collection",

//     itemIds: [distillMessageToolPocItem.id, queryMemoryToolPocItem.id]
// } satisfies CollectionInterface

// const interfaces = [
//     captureThoughtInterface,
//     configureShortcutsInterface,
//     alteredOnboardingInterface,
//     viewThoughtsInterface
// ] as const satisfies readonly Interface[]

// export {
//     ACTION_PALETTE_INTERFACE_ID,
//     alteredOnboardingInterface,
//     captureThoughtInterface,
//     configureShortcutsInterface,
//     interfaces,
//     viewThoughtsInterface
// }
