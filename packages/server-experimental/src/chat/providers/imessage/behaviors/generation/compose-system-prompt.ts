import { constructPrompts } from "../../../../../ai/prompts/constructor"
import { createEnvironmentSystemPrompt } from "../../../../../ai/prompts/environment"
import { IDENTITY_SYSTEM_PROMPT } from "../../../../../ai/prompts/identity"
import { IMESSAGE_SYSTEM_PROMPT } from "./prompt"

function composeSystemPrompt(): string {
    return constructPrompts([
        IDENTITY_SYSTEM_PROMPT,
        createEnvironmentSystemPrompt(),
        IMESSAGE_SYSTEM_PROMPT
    ])
}

export { composeSystemPrompt }
