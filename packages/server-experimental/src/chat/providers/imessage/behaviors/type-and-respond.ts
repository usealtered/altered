import type { Message, Thread } from "chat"
import type { ALTEREDChat } from "../../../instance"

type ChatResponseContext = {
    chat: ALTEREDChat
    thread: Thread
    message: Message
}

async function typeAndRespond(
    context: ChatResponseContext,
    createResponse: (context: ChatResponseContext) => string | Promise<string>
): Promise<void> {
    const { chat, thread, message } = context

    const adapter = chat.getAdapter("sendblue")
    await adapter.sendReadReceipt(thread.id)

    await thread.startTyping()

    const inboundMessage = message.text.trim()
    const outboundMessage = await createResponse(context)
    await thread.post(outboundMessage)

    //  TODO: Remove this demo code once we have replacement behaviour.

    if (inboundMessage.toLowerCase().startsWith("/sub"))
        if (await thread.isSubscribed()) {
            await thread.unsubscribe()
            await thread.post("Unsubscribed.")
        } else {
            await thread.subscribe()
            await thread.post("Subscribed.")
        }
}

export { type ChatResponseContext, typeAndRespond }
