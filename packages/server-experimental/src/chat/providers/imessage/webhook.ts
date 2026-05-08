import { getAlteredChat } from "../../instance"

function processSendblueWebhook(
    request: Request,
    options?: { waitUntil?: (task: Promise<unknown>) => void }
): Promise<Response> {
    const chat = getAlteredChat()

    return chat.webhooks.sendblue(request, options)
}

export { processSendblueWebhook }
