import type { ALTEREDThought } from "@altered/core-experimental/models/thoughts/definitions"
import type { ComponentType } from "react"
import type { NavigationPath } from "../navigation/definitions"

type InterfaceOperationProps = {
    thought: ALTEREDThought
    navigationHistory: NavigationPath[]
}

type OperationDefinition = {
    id: string

    type: "custom-operation"

    component: ComponentType<InterfaceOperationProps>
}

type OperationGroupDefinition = {
    id: string

    type: "operation-group"
    title: string

    items: OperationDefinition[]
}

type OperationsDefinition = OperationDefinition | OperationGroupDefinition

export type {
    InterfaceOperationProps,
    OperationDefinition,
    OperationGroupDefinition,
    OperationsDefinition
}
