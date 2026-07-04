import type { SystemModelMessage, ToolLoopAgentSettings } from "ai"

/**
 * Resolves an ambiguous agent instructions parameter to a `SystemModelMessage` array.
 *
 * @todo P2: Consider adding support to resolve to a string, or another method that allows combining two system messages into one.
 */
function resolveAgentInstructions(
    instructions: ToolLoopAgentSettings["instructions"],

    config?: { providerOptions?: SystemModelMessage["providerOptions"] }
): SystemModelMessage[] {
    const { providerOptions } = config ?? {}

    if (!instructions) return []

    if (typeof instructions === "string")
        return [
            {
                role: "system",
                content: instructions,

                providerOptions
            }
        ]

    if (!Array.isArray(instructions)) return [instructions]

    return instructions
}

export { resolveAgentInstructions }
