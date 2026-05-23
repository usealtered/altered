import { composeSystemPrompt } from "../src/chat/providers/imessage/behaviors/generation/compose-system-prompt"

const { initial: initialSystemPrompt, ephemeral: ephemeralSystemPrompt } =
    composeSystemPrompt()

console.log("\n--- INITIAL SYSTEM PROMPT ---\n")
console.log(initialSystemPrompt)
console.log("\n--- END INITIAL SYSTEM PROMPT ---\n")

console.log("\n--- EPHEMERAL SYSTEM PROMPT ---\n")
console.log(ephemeralSystemPrompt)
console.log("\n--- END EPHEMERAL SYSTEM PROMPT ---\n")
