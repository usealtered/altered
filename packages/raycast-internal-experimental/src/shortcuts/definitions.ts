import { join } from "node:path"
import { environment } from "@raycast/api"

const SHORTCUT_SCRIPT_COMMANDS_DIRECTORY = join(
    environment.supportPath,
    "shortcuts/script-commands"
)

export { SHORTCUT_SCRIPT_COMMANDS_DIRECTORY }
