import { styleTerminalText } from "@altered/core-experimental/misc/style-terminal-text"

export const customLogger = (message: string, ...rest: string[]) => {
    const newMessage = message
        .replace("<--", styleTerminalText(">>>"))
        .replace("-->", styleTerminalText("<<<"))

    console.log(newMessage, ...rest)
}
