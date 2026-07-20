import { Detail } from "@raycast/api"
import { useMemo } from "react"
import type { InterfaceComponentProps } from "../../definitions"
import { resolveNavigationTitle } from "../../navigation/resolve-title"
import { InterfaceOperationsRenderer } from "../../operations/implementation"
import { MARKDOWN_INTERFACE_OPERATIONS_DEFINITION } from "./operations/definitions"

function MarkdownInterface({
    navigationHistory,

    thought
}: InterfaceComponentProps) {
    const navigationTitle = useMemo(
        () => resolveNavigationTitle({ navigationHistory }),
        [navigationHistory]
    )

    const markdown = useMemo(() => {
        if (thought.content.trimStart().startsWith("#")) return thought.content

        return `# ${thought.alias}\n\n${thought.content}`
    }, [thought.content, thought.alias])

    return (
        <Detail
            actions={
                <InterfaceOperationsRenderer
                    navigationHistory={navigationHistory}
                    operations={MARKDOWN_INTERFACE_OPERATIONS_DEFINITION}
                    thought={thought}
                />
            }
            markdown={markdown}
            navigationTitle={navigationTitle}
        />
    )
}

export { MarkdownInterface }
