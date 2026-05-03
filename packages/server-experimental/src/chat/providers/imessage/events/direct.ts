import type { DirectMessageHandler, Message, Thread } from "chat"
import type { ALTEREDChat } from "../../../instance"
import { generateResponse } from "../behaviors/generate-response/handler"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleDirectMessage(chat: ALTEREDChat): DirectMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        console.log("Direct message received:", message)

        await typeAndRespond({ chat, thread, message }, generateResponse)
    }
}

export { handleDirectMessage }
