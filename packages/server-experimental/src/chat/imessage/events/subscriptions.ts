import type { Message, SubscribedMessageHandler, Thread } from "chat"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleSubscriptionMessage(
    handle: (content: string) => string | Promise<string>
): SubscribedMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        //  TODO P1: Update once we fix the adapter.

        await typeAndRespond(thread, message, handle)
    }
}

export { handleSubscriptionMessage }
