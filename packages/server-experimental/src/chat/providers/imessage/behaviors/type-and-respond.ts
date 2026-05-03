import type { Message, Thread } from "chat"
import type { ALTEREDChat } from "../../../instance"

async function typeAndRespond(
    context: {
        chat: ALTEREDChat
        thread: Thread
        message: Message
    },
    createResponse: (message: string) => string | Promise<string>
): Promise<void> {
    const { chat, thread, message } = context

    const adapter = chat.getAdapter("sendblue")
    await adapter.sendReadReceipt(thread.id)

    await thread.startTyping()
    await new Promise(resolve => setTimeout(resolve, 3000))

    const inboundMessage = message.text.trim()
    const outboundMessage = await createResponse(inboundMessage)
    await thread.post(outboundMessage)

    if (inboundMessage.toLowerCase().startsWith("/sub"))
        if (await thread.isSubscribed()) {
            await thread.unsubscribe()
            await thread.post("Unsubscribed.")
        } else {
            await thread.subscribe()
            await thread.post("Subscribed.")
        }
}

export { typeAndRespond }
