import { botDefaultModelId } from "@altered/core-experimental/config/app"
import { generateText } from "ai"
import { constructPrompts } from "../../../../../ai/prompts/constructor"
import { IDENTITY_SYSTEM_PROMPT } from "../../../../../ai/prompts/identity"
import { getOpenRouter } from "../../../../../ai/provider"
import { IMESSAGE_SYSTEM_PROMPT } from "./prompt"

async function generateResponse(message: string): Promise<string> {
    const openRouter = getOpenRouter()

    const { text } = await generateText({
        model: openRouter.chat(botDefaultModelId),

        system: constructPrompts([
            IDENTITY_SYSTEM_PROMPT,
            IMESSAGE_SYSTEM_PROMPT
        ]),

        prompt: message
    })

    return text
}

export { generateResponse }
