/**
 * @todo P2: Adapt to accept `SystemModelMessage`.
 */
function composeInstructions(
    instructions: (string | null)[],

    options?: {
        /**
         * @default "\n\n"
         */
        delimiter?: string

        /**
         * @default true
         */
        trim?: boolean
    }
): string {
    const { delimiter = "\n\n", trim = true } = options ?? {}

    return instructions
        .filter(instruction => instruction !== null)
        .map(instruction => (trim ? instruction.trim() : instruction))
        .join(delimiter)
}

export { composeInstructions }
