import { Action, Icon, open, showHUD } from "@raycast/api"
import { useMemo } from "react"
import { WEB_ORIGIN } from "../../../../../commands/action-palette/config"
import { useInterfaceRendererContext } from "../../../../../commands/action-palette/interfaces/context"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

/**
 * @remarks Demo, replace with actual implementation.
 */
function OpenInBrowserOperation({ thought }: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.Globe,
            tintColor
        }
    }, [isIconVisible, tintColor])

    return (
        <Action
            icon={iconProps}
            onAction={async () => {
                await showHUD("Opening in browser...")

                await open(`${WEB_ORIGIN}/t/${thought.id}`)
            }}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "o"
            }}
            title="Open In Browser"
        />
    )
}

const OPEN_IN_BROWSER_OPERATION_DEFINITION = {
    id: "open-in-browser-operation",
    type: "custom-operation",
    component: OpenInBrowserOperation
} satisfies OperationDefinition

export { OPEN_IN_BROWSER_OPERATION_DEFINITION }
