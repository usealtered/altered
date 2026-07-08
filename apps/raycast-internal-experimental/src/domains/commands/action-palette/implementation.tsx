import { actionPaletteInterfaces } from "./definitions"
import { InterfaceRenderer } from "./interfaces/renderer"

function ActionPaletteCommand() {
    return <InterfaceRenderer interfaces={actionPaletteInterfaces} />
}

export { ActionPaletteCommand }
