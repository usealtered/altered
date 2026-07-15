import {
    Action,
    Clipboard,
    closeMainWindow,
    Icon,
    open,
    PopToRootType,
    showToast,
    Toast
} from "@raycast/api"
import { SHORTCUT_SCRIPT_COMMANDS_DIRECTORY } from "../../definitions"
import { ensureShortcutScriptCommandsDirectory } from "../../utils"
import { RAYCAST_SETTINGS_DEEPLINK } from "../definitions"

function CopyDirectoryAndOpenSettingsAction({
    setHasOpenedSettings
}: {
    setHasOpenedSettings?: (value: boolean) => void
}) {
    const copyDirectoryAndOpenSettings = async () => {
        await ensureShortcutScriptCommandsDirectory()

        await Clipboard.copy(SHORTCUT_SCRIPT_COMMANDS_DIRECTORY)

        await open(RAYCAST_SETTINGS_DEEPLINK)

        await showToast({
            style: Toast.Style.Success,
            title: "Directory Copied",
            message: "The directory has been copied to clipboard."
        })
    }

    return (
        <Action
            icon={Icon.ArrowRightCircle}
            onAction={async () => {
                await copyDirectoryAndOpenSettings()

                setHasOpenedSettings?.(true)
            }}
            title="Copy Directory and Open Settings"
        />
    )
}

function DismissSetUpShortcutsAction() {
    return (
        <Action
            icon={Icon.XMarkTopRightSquare}
            onAction={() =>
                closeMainWindow({
                    popToRootType: PopToRootType.Immediate,
                    clearRootSearch: true
                })
            }
            title="Dismiss"
        />
    )
}

export { CopyDirectoryAndOpenSettingsAction, DismissSetUpShortcutsAction }
