import type { DirectMessageHandler, Message, Thread } from "chat"
import type { ALTEREDChat } from "../../../../instance"
import { typeAndRespond } from "../../behaviors/type-and-respond"
import { buildDirectMessageResponse } from "./build-response"

/**
 * @todo P1: Convert logging to use Effect.
 */
function handleDirectMessage(chat: ALTEREDChat): DirectMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        console.log("Direct message received:", message)

        await typeAndRespond(
            { chat, thread, message },
            buildDirectMessageResponse
        )
    }
}

export { handleDirectMessage }
