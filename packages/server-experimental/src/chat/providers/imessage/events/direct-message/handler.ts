import type { DirectMessageHandler, Message, Thread } from "chat"
import type { ALTEREDChat } from "../../../../instance"
import { typeAndRespond } from "../../behaviors/type-and-respond"
import { buildDirectMessageResponse } from "./build-response"

function handleDirectMessage(chat: ALTEREDChat): DirectMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        await typeAndRespond(
            { chat, thread, message },
            buildDirectMessageResponse
        )
    }
}

export { handleDirectMessage }
