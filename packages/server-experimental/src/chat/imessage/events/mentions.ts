import type { MentionHandler, Message, Thread } from "chat"
import type { ALTEREDChat } from "../../provider"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleMessageWithMention(chat: ALTEREDChat): MentionHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        console.log("Message with mention received:", message)

        await typeAndRespond(
            { chat, thread, message },
            content => `[mention] Received: "${content}"`
        )
    }
}

export { handleMessageWithMention }
