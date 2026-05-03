//  TODO P0: Implement with Effect.

import type { TerminalTextStyle } from "../misc/style-terminal-text"

export const name = "ALTERED" as const
export const version = "0.1.0" as const

export const terminalTextAccentStyle: TerminalTextStyle[] = ["green"] as const

export const botUsername = "kAI" as const

/**
 * @todo P2: Split model defaults based on use case - for different tasks (such as chat, retrieval, code, etc.) we should have variability for intelligence, style, and cost/context.
 */
export const botDefaultModelId = "anthropic/claude-sonnet-4.6" as const
