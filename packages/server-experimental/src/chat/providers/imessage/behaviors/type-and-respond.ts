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

    const inboundMessage = message.text.trim()
    const outboundMessage = await createResponse(inboundMessage)
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

export { typeAndRespond }
