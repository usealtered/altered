import { Action, Icon, showHUD } from "@raycast/api"
import { WEB_ORIGIN } from "../../../../../commands/action-palette/config"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

/**
 * @remarks Demo, replace with actual implementation.
 */
function OpenInBrowserOperation({ thought }: InterfaceOperationProps) {
    return (
        <Action.OpenInBrowser
            icon={Icon.Globe}
            onOpen={() => showHUD("Opening in browser...")}
            shortcut={{
                modifiers: ["cmd", "shift"],
                key: "o"
            }}
            title="Open In Browser"
            url={`${WEB_ORIGIN}/t/${thought.id}`}
        />
    )
}

const OPEN_IN_BROWSER_OPERATION_DEFINITION = {
    id: "open-in-browser-operation",
    type: "custom-operation",
    component: OpenInBrowserOperation
} satisfies OperationDefinition

export { OPEN_IN_BROWSER_OPERATION_DEFINITION }
