import { ActionPanel } from "@raycast/api"
import type {
    InterfaceOperationProps,
    OperationDefinition,
    OperationGroupDefinition
} from "./definitions"

/**
 * @todo P3: Revise props and definition structure.
 */
function InterfaceOperationsRenderer({
    operations,

    navigationHistory,
    thought
}: {
    operations: (OperationDefinition | OperationGroupDefinition)[]
} & InterfaceOperationProps) {
    return (
        <ActionPanel>
            {operations.map(operation => {
                if (operation.type === "custom-operation") {
                    const Operation = operation.component

                    return (
                        <Operation
                            key={operation.id}
                            navigationHistory={navigationHistory}
                            thought={thought}
                        />
                    )
                }

                if (operation.type === "operation-group") {
                    if (!operation.items.length) return null

                    return (
                        <ActionPanel.Section
                            key={operation.id}
                            title={operation.title}
                        >
                            {operation.items.map(item => {
                                const Operation = item.component

                                return (
                                    <Operation
                                        key={item.id}
                                        navigationHistory={navigationHistory}
                                        thought={thought}
                                    />
                                )
                            })}
                        </ActionPanel.Section>
                    )
                }

                return null
            })}
        </ActionPanel>
    )
}

export { InterfaceOperationsRenderer }
