import type { MentionHandler, Message, Thread } from "chat"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleMessageWithMention(
    handle: (content: string) => string | Promise<string>
): MentionHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        //  TODO P1: Update to remove irrelevant components once we fix the adapter and migrate to just using the DM handler.

        await thread.subscribe()

        await typeAndRespond(thread, message, handle)
    }
}

export { handleMessageWithMention }
