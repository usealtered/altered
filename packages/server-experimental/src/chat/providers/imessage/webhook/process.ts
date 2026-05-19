import { isDevelopment } from "@altered/core-experimental/config/environment/is-development"
import { FORWARD_WEBHOOK_TRIGGER_PHRASES } from "@altered/server-experimental/chat/messages/commands/definitions"
import type { SendblueMessagePayload } from "chat-adapter-sendblue"
import { getAlteredChat } from "../../../instance"
import { stripCommandTriggerPhrases } from "../../../messages/commands/strip-trigger-phrases"
import { respondFromRaw } from "../behaviors/respond-from-raw"
import {
    containsForwardWebhookTriggerPhrase,
    forwardSendblueWebhook,
    hasPermissionToForwardWebhook,
    isForwardedWebhook
} from "./forwarding"
import { parseSendblueWebhook } from "./parse"

async function processSendblueWebhook(
    request: Request,
    options?: { waitUntil?: (task: Promise<unknown>) => void }
): Promise<Response> {
    const handleWebhook = getAlteredChat().webhooks.sendblue

    if (isDevelopment() || isForwardedWebhook(request))
        return handleWebhook(request, options)

    const parsedRequest = await parseSendblueWebhook(request)
    if (!parsedRequest)
        throw new Error(
            "Failed to parse Sendblue webhook request. This should never happen.",
            { cause: request }
        )

    if (
        containsForwardWebhookTriggerPhrase({
            messagePayload: parsedRequest.data
        })
    ) {
        const strippedData: SendblueMessagePayload = {
            ...parsedRequest.data,

            content: stripCommandTriggerPhrases({
                message: parsedRequest.data.content,
                phrases: [...FORWARD_WEBHOOK_TRIGGER_PHRASES]
            })
        }

        if (
            hasPermissionToForwardWebhook({
                messagePayload: parsedRequest.data
            })
        ) {
            //  TODO P2: Figure out how to use `waitUntil` here, with a fallback caller for when it is not defined.

            const { success } = await forwardSendblueWebhook({
                request,
                messagePayload: strippedData
            })

            if (!success)
                await respondFromRaw({
                    messagePayload: parsedRequest.data,
                    createResponse: _context =>
                        "Unable to reach the development server. Please try again later."
                })

            return new Response("OK", { status: 200 })
        }

        await respondFromRaw({
            messagePayload: parsedRequest.data,
            createResponse: _context =>
                "You do not have permission to use this feature."
        })

        return new Response("OK", { status: 200 })
    }

    return handleWebhook(
        new Request(request.url, {
            body: parsedRequest.body.text,
            headers: request.headers,
            method: request.method
        }),

        options
    )
}

export { processSendblueWebhook }
