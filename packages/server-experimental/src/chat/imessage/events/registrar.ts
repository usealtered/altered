import type { Chat } from "chat"
import type { SendblueAdapter } from "chat-adapter-sendblue"
import { handleDirectMessage } from "./direct"
import { handleMessageWithMention } from "./mentions"
import { handleSubscriptionMessage } from "./subscriptions"

export function registerImessageChatEventHandlers(
    chat: Chat<{ sendblue: SendblueAdapter }>
): void {
    chat.onDirectMessage(
        handleDirectMessage(content => `[direct] Received: "${content}"`)
    )

    chat.onNewMention(
        handleMessageWithMention(content => `[mention] Received: "${content}"`)
    )

    chat.onSubscribedMessage(
        handleSubscriptionMessage(
            content => `[subscription] Received: "${content}"`
        )
    )
}
