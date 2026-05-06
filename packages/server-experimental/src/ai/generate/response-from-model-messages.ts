import { botDefaultModelId } from "@altered/core-experimental/config/app"
import { generateText, type ModelMessage } from "ai"
import { constructPrompts } from "../prompts/constructor"
import { IDENTITY_SYSTEM_PROMPT } from "../prompts/identity"
import { getOpenRouter } from "../provider"

/**
 * @remarks Coming up, we may want to return the entire message part/content rather than just the text.
 */
async function generateResponseFromModelMessages(
    messages: ModelMessage[],
    config?: { prompts?: string[] }
): Promise<string> {
    const { prompts = [IDENTITY_SYSTEM_PROMPT] } = config ?? {}

    const openRouter = getOpenRouter()

    const { text } = await generateText({
        model: openRouter.chat(botDefaultModelId),

        system: constructPrompts(prompts),

        messages
    })

    return text
}

export { generateResponseFromModelMessages }
