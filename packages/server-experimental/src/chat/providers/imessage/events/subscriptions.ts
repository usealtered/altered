import type { Message, SubscribedMessageHandler, Thread } from "chat"
import type { ALTEREDChat } from "../../../instance"
import { typeAndRespond } from "../behaviors/type-and-respond"

function handleSubscriptionMessage(
    chat: ALTEREDChat
): SubscribedMessageHandler {
    return async (thread: Thread, message: Message): Promise<void> => {
        console.log("Subscription message received:", message)

        await typeAndRespond(
            { chat, thread, message },
            context => `[subscription] Received: "${context.message.text}"`
        )
    }
}

export { handleSubscriptionMessage }
