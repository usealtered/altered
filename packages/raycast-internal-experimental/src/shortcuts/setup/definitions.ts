import { SHORTCUT_SCRIPT_COMMANDS_DIRECTORY } from "../definitions"

/**
 * @todo P2: We may need to adjust the URL scheme when Raycast X comes out of beta.
 */
const RAYCAST_SETTINGS_DEEPLINK =
    "raycast-x://extensions/raycast/raycast/settings"

const SET_UP_SHORTCUTS_MARKDOWN = `

# Set Up Shortcuts

ALTERED shortcuts are installed as Raycast Script Commands in the extension support directory:

\`${SHORTCUT_SCRIPT_COMMANDS_DIRECTORY}\`

## Instructions

1. Press \`Enter\` to copy the directory and open Raycast Settings.
2. Go to the \`Script Commands\` tab.
3. In the \`Script Folders\` section, click the plus icon (\`+\`) in the top right.
4. Once the Finder window is open, press \`Cmd + Shift + G\`, paste the copied path and press \`Enter\` to open the directory, then press \`Enter\` again to add the directory.

When completed, ALTERED shortcuts will appear in the Raycast root search when installed.

`.trim()

export { RAYCAST_SETTINGS_DEEPLINK, SET_UP_SHORTCUTS_MARKDOWN }
