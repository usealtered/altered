import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { SHORTCUT_SCRIPT_COMMANDS_DIRECTORY } from "./definitions"

async function ensureShortcutScriptCommandsDirectory() {
    await mkdir(SHORTCUT_SCRIPT_COMMANDS_DIRECTORY, { recursive: true })
}

function quoteAndEscapeShellArgument(value: string) {
    return `"${value.replaceAll(/(["\\$`])/g, "\\$1")}"`
}

function createShortcutScriptCommandFilePath({ id }: { id: string }) {
    const fileName = `${id}`.replaceAll(/[^a-zA-Z0-9-]/g, "-")

    return join(SHORTCUT_SCRIPT_COMMANDS_DIRECTORY, `${fileName}.sh`)
}

export {
    createShortcutScriptCommandFilePath,
    ensureShortcutScriptCommandsDirectory,
    quoteAndEscapeShellArgument
}
