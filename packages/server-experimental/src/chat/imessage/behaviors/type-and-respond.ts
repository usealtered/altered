import type { Message, Thread } from "chat"

async function typeAndRespond(
    thread: Thread,
    message: Message,
    handle: (content: string) => string | Promise<string>
): Promise<void> {
    await thread.startTyping()
    await new Promise(resolve => setTimeout(resolve, 500))

    const inboundMessage = message.text.trim()
    if (!inboundMessage) return

    const outboundMessage = await handle(inboundMessage)

    await thread.post(outboundMessage)
}

export { typeAndRespond }
