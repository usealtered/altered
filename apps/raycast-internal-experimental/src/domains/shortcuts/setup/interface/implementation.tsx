import { ActionPanel, Detail } from "@raycast/api"
import { useState } from "react"
import { SET_UP_SHORTCUTS_MARKDOWN } from "../definitions"
import {
    CopyDirectoryAndOpenSettingsAction,
    DismissSetUpShortcutsAction
} from "./actions"

function SetUpShortcutsInterface() {
    const [hasOpenedSettings, setHasOpenedSettings] = useState(false)

    return (
        <Detail
            actions={
                <ActionPanel>
                    {hasOpenedSettings ? (
                        <>
                            <DismissSetUpShortcutsAction />
                            <CopyDirectoryAndOpenSettingsAction />
                        </>
                    ) : (
                        <>
                            <CopyDirectoryAndOpenSettingsAction
                                setHasOpenedSettings={setHasOpenedSettings}
                            />
                            <DismissSetUpShortcutsAction />
                        </>
                    )}
                </ActionPanel>
            }
            key={"set-up-shortcuts"}
            markdown={SET_UP_SHORTCUTS_MARKDOWN}
            navigationTitle="Set Up Shortcuts"
        />
    )
}

export { SetUpShortcutsInterface }
