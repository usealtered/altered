import type { DirectMessageHandler, Message, Thread } from "chat"
import type { ALTEREDChat } from "../../provider"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleDirectMessage(chat: ALTEREDChat): DirectMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        console.log("Direct message received:", message)

        await typeAndRespond(
            { chat, thread, message },
            content => `[direct] Received: "${content}"`
        )
    }
}

export { handleDirectMessage }
