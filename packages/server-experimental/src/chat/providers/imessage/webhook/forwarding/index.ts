import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import type { SendblueMessagePayload } from "chat-adapter-sendblue"
import type { WebhookForwardingTarget } from "./preference"

const SENDBLUE_SIGNING_HEADER_NAME = "sb-signing-secret"

const FORWARDED_REQUEST_HEADER_NAME = "x-altered-forwarded-request"
const FORWARDED_REQUEST_HEADER_VALUE = "1"
const FORWARDED_REQUEST_TARGET_HEADER_NAME = "x-altered-forwarded-target"

function createSendblueWebhookForwardingHeaders({
    headers,
    target
}: {
    headers: Headers
    target: WebhookForwardingTarget
}): Headers {
    const forwardingHeaders = new Headers()

    forwardingHeaders.set("content-type", "application/json")

    const signingSecret = headers.get(SENDBLUE_SIGNING_HEADER_NAME)
    if (signingSecret)
        forwardingHeaders.set(SENDBLUE_SIGNING_HEADER_NAME, signingSecret)

    forwardingHeaders.set(
        FORWARDED_REQUEST_HEADER_NAME,
        FORWARDED_REQUEST_HEADER_VALUE
    )
    forwardingHeaders.set(FORWARDED_REQUEST_TARGET_HEADER_NAME, target)

    return forwardingHeaders
}

const isForwardedWebhook = (request: Request): boolean =>
    request.headers.get(FORWARDED_REQUEST_HEADER_NAME) ===
    FORWARDED_REQUEST_HEADER_VALUE

const getForwardedWebhookTarget = (
    request: Request
): WebhookForwardingTarget | null => {
    const target = request.headers.get(FORWARDED_REQUEST_TARGET_HEADER_NAME)

    return target === "preview-development" ? target : null
}

const checkPermissionToForwardWebhook = ({
    messagePayload
}: {
    messagePayload: SendblueMessagePayload
}): boolean =>
    messagePayload.from_number ===
    getEnvironmentConfig().shared.admin.phoneNumber

/**
 * @todo P3: Use environment config once optional entries exist there.
 */
function getSendblueWebhookUrl({
    target
}: {
    target: WebhookForwardingTarget
}): string | null {
    const targetOrigin =
        target === "preview-development"
            ? (process.env.SHARED_PROVIDER_PREVIEW_API_URL?.trim() ?? null)
            : null

    const SENDBLUE_WEBHOOK_PATH = "/webhooks/sendblue"

    return targetOrigin
        ? new URL(SENDBLUE_WEBHOOK_PATH, targetOrigin).toString()
        : null
}

/**
 * @todo P1: Add retry logic and error handling once Effect is implemented.
 */
async function forwardSendblueWebhook({
    request,
    messagePayload,
    target
}: {
    request: Request
    messagePayload: SendblueMessagePayload
    target: WebhookForwardingTarget
}): Promise<{ success: boolean }> {
    const webhookUrl = getSendblueWebhookUrl({ target })
    if (!webhookUrl) return { success: false }

    const forwardingHeaders = createSendblueWebhookForwardingHeaders({
        headers: request.headers,
        target
    })

    try {
        const response = await fetch(webhookUrl, {
            body: JSON.stringify(messagePayload),
            headers: forwardingHeaders,
            method: request.method
        })

        return { success: response.ok }
    } catch {
        return { success: false }
    }
}

export {
    checkPermissionToForwardWebhook,
    FORWARDED_REQUEST_HEADER_NAME,
    FORWARDED_REQUEST_HEADER_VALUE,
    FORWARDED_REQUEST_TARGET_HEADER_NAME,
    forwardSendblueWebhook,
    getForwardedWebhookTarget,
    isForwardedWebhook
}
