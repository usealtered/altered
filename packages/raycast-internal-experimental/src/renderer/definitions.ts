import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"
import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import type { ComponentType } from "react"
import { CollectionInterface } from "../commands/action-palette/interfaces/collections/implementation"
import { MarkdownInterface } from "./markdown/interface"
import type { NavigationPath } from "./navigation/definitions"

type InterfaceTypeID = "collection" | "markdown"

type InterfaceComponentProps = {
    navigationHistory: NavigationPath[]

    thought: ALTEREDThought
    attributes: ALTEREDAttribute[]
}

const INTERFACE_COMPONENT_MAP = {
    collection: CollectionInterface,

    markdown: MarkdownInterface
} as const satisfies Record<
    InterfaceTypeID,
    ComponentType<InterfaceComponentProps>
>

export {
    INTERFACE_COMPONENT_MAP,
    type InterfaceComponentProps,
    type InterfaceTypeID
}
