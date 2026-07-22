import type { ALTEREDAttribute } from "@altered/core-experimental/models/attributes/definitions"
import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import type { ComponentType } from "react"
import { CollectionInterface } from "./collections/interface/implementation"
import { MarkdownInterface } from "./markdown/interface/implementation"
import type { NavigationPath } from "./navigation/definitions"

type InterfaceTypeID = "collection" | "markdown"

type InterfaceComponentProps = {
    navigationHistory: NavigationPath[]

    /**
     * @remarks Could this just be a thought ID?
     */
    thought: ALTEREDThought

    /**
     * @remarks Do we need this at all, or can we re-fetch from cache in components?
     */
    attributes: ALTEREDAttribute[] | null
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
