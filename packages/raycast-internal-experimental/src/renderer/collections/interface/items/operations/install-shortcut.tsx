import { Action, Icon } from "@raycast/api"
import { useMemo } from "react"
import { ACTION_PALETTE_COMMAND_NAME } from "../../../../../commands/action-palette/definitions"
import { useInterfaceRendererContext } from "../../../../../commands/action-palette/interfaces/context"
import { installShortcutScriptCommand } from "../../../../../shortcuts/installation/implementation"
import type {
    InterfaceOperationProps,
    OperationDefinition
} from "../../../../operations/definitions"

function InstallShortcutOperation({ thought }: InterfaceOperationProps) {
    const { tintColor, isIconVisible } = useInterfaceRendererContext()

    const iconProps = useMemo(() => {
        if (!isIconVisible.value) return null

        return {
            source: Icon.Download,
            tintColor
        }
    }, [isIconVisible, tintColor])

    if (!thought.id) return null

    return (
        <Action
            icon={iconProps}
            onAction={() =>
                installShortcutScriptCommand({
                    id: thought.id,
                    title: thought.alias,

                    description: thought.content,

                    target: {
                        type: "command",

                        name: ACTION_PALETTE_COMMAND_NAME,
                        launchContext: { actionId: thought.id }
                    }
                })
            }
            title="Install Shortcut"
        />
    )
}

const INSTALL_SHORTCUT_OPERATION_DEFINITION = {
    id: "install-shortcut-operation",
    type: "custom-operation",
    component: InstallShortcutOperation
} satisfies OperationDefinition

export { INSTALL_SHORTCUT_OPERATION_DEFINITION }
