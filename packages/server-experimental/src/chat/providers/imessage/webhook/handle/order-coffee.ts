import { runCoffeeOrderingDemoAgent } from "../../../../../ai/agents/coffee-ordering-demo/run"
import { respondFromRaw } from "../../behaviors/respond-from-raw"
import { afterResponse } from "../after-response"
import type { SendblueWebhookContext } from "../process"

async function handleOrderCoffeeDemoMessageIngestStep({
    request,
    waitUntil
}: SendblueWebhookContext): Promise<{
    shouldContinue: boolean
}> {
    const { status, messages } = await runCoffeeOrderingDemoAgent({
        message: request.message
    })

    if (status === "skipped") return { shouldContinue: true }

    if (status === "failed") {
        console.error("Coffee ordering agent failed", {
            input: request.message,
            output: messages
        })

        return { shouldContinue: true }
    }

    const afterWebhookAcknowledgementTask = async () => {
        const lastAssistantMessageContent = messages.findLast(
            message => message.role === "assistant"
        )?.content

        const confirmationMessage =
            typeof lastAssistantMessageContent === "string"
                ? lastAssistantMessageContent
                : lastAssistantMessageContent?.findLast(
                      content => content.type === "text"
                  )?.text

        await respondFromRaw({
            messagePayload: request.payload,
            createResponse: _context =>
                confirmationMessage ??
                "Coffee was ordered, but the agent did not comment on the order."
        })
    }

    afterResponse(afterWebhookAcknowledgementTask, waitUntil)

    return { shouldContinue: false }
}

export { handleOrderCoffeeDemoMessageIngestStep }
