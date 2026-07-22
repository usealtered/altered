import { isDevelopment } from "@altered/core-experimental/config/environment/is-development"
import type { WebhookOptions } from "chat"
import type { SendblueMessagePayload } from "chat-adapter-sendblue"
import { initializeAlteredChat } from "../../../instance"
import { respondFromRaw } from "../behaviors/respond-from-raw"
import {
    createWebhookForwardingConfirmationMessage,
    resolveAdminWebhookForwardingDecision
} from "./admin-immediate-tasks"
import { afterResponse } from "./after-response"
import {
    checkPermissionToForwardWebhook,
    forwardSendblueWebhook,
    isForwardedWebhook
} from "./forwarding"
import {
    getWebhookForwardingTargetPreference,
    setWebhookForwardingTargetPreference
} from "./forwarding/preference"
import { handleDesignatedWebhook } from "./handle/designated"
import { parseSendblueWebhook } from "./parse"

type ProcessSendblueWebhookOptions = {
    request: Request
    options?: Pick<WebhookOptions, "waitUntil">
}

type SendblueWebhookContext = {
    request: {
        raw: Request
        text: string
        payload: SendblueMessagePayload
        message: string
    }

    waitUntil: WebhookOptions["waitUntil"]
}

/**
 * @todo P2: Extract this admin command flow into reusable command tools.
 */
async function processSendblueWebhook({
    request,
    options
}: ProcessSendblueWebhookOptions): Promise<Response> {
    const chat = await initializeAlteredChat()

    const handleWebhook = chat.webhooks.sendblue

    const parsedRequest = await parseSendblueWebhook(request)
    if (!parsedRequest)
        throw new Error(
            "Failed to parse Sendblue webhook request. This should never happen.",
            { cause: request }
        )

    const messagePayload = parsedRequest.data

    const context: SendblueWebhookContext = {
        request: {
            raw: request,
            text: parsedRequest.body.text,
            payload: messagePayload,
            message: messagePayload.content
        },
        waitUntil: options?.waitUntil
    }

    // afterResponse should wrap everything, except that of which may redirect the response (exclude forwarding) - meaning the only remaining factor is 200 vs 4XX (webhook handler) - so we must resolve whether Chat SDK is handling it (and return that, or alternatively, call it ourselves)

    if (isDevelopment() || isForwardedWebhook(request))
        return await handleDesignatedWebhook(context)

    if (checkPermissionToForwardWebhook({ messagePayload })) {
        const forwardingDecision = await resolveAdminWebhookForwardingDecision({
            message: messagePayload.content
        })

        if (forwardingDecision) {
            afterResponse(async () => {
                const { success } = await setWebhookForwardingTargetPreference({
                    phoneNumber: messagePayload.from_number,
                    target: forwardingDecision.target
                })

                if (!success) {
                    await respondFromRaw({
                        messagePayload,
                        createResponse: _context =>
                            "Unable to update webhook forwarding mode right now. Please try again later."
                    })

                    return
                }

                const confirmation =
                    await createWebhookForwardingConfirmationMessage({
                        target: forwardingDecision.target
                    })

                await respondFromRaw({
                    messagePayload,
                    createResponse: _context => confirmation
                })
            }, options?.waitUntil)

            return new Response("OK", { status: 200 })
        }

        const { success, value: forwardingTarget } =
            await getWebhookForwardingTargetPreference({
                phoneNumber: messagePayload.from_number
            })

        if (!success) {
            console.error(
                "Failed to check webhook forwarding target. Falling back to production mode."
            )

            return handleWebhook(
                new Request(request.url, {
                    body: parsedRequest.body.text,
                    headers: request.headers,
                    method: request.method
                }),

                options
            )
        }

        if (forwardingTarget !== "none") {
            afterResponse(async () => {
                const { success: forwardSuccess } =
                    await forwardSendblueWebhook({
                        request,
                        messagePayload,
                        target: forwardingTarget
                    })

                if (!forwardSuccess)
                    console.error(
                        `Failed to forward Sendblue webhook to target "${forwardingTarget}".`
                    )
            }, options?.waitUntil)

            return new Response("OK", { status: 200 })
        }
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

export {
    type ProcessSendblueWebhookOptions,
    processSendblueWebhook,
    type SendblueWebhookContext
}
