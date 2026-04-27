import type { DirectMessageHandler, Message, Thread } from "chat"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleDirectMessage(
    handle: (content: string) => string | Promise<string>
): DirectMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        //  TODO P1: Update to omit subscription once we fix the adapter.

        await thread.subscribe()

        await typeAndRespond(thread, message, handle)
    }
}

export { handleDirectMessage }
