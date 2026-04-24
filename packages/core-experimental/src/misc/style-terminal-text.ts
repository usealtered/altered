import { type InspectColor, styleText } from "node:util"
import { terminalTextAccentStyle } from "../config/app"

export type TerminalTextStyle = InspectColor

const defaultStyle = terminalTextAccentStyle

export function styleTerminalText(
    text: string,
    style:
        | TerminalTextStyle[]
        | ((
              defaultStyle: TerminalTextStyle[]
          ) => TerminalTextStyle[]) = defaultStyle
) {
    const resolvedStyle =
        typeof style === "function" ? style(defaultStyle) : style

    return styleText(resolvedStyle, text)
}
