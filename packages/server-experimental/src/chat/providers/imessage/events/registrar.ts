import type { ALTEREDChat } from "../../../instance"
import { handleDirectMessage } from "./direct"
import { handleMessageWithMention } from "./mentions"
import { handleSubscriptionMessage } from "./subscriptions"

export function registerImessageChatEventHandlers(chat: ALTEREDChat): void {
    chat.onDirectMessage(handleDirectMessage(chat))
    chat.onNewMention(handleMessageWithMention(chat))
    chat.onSubscribedMessage(handleSubscriptionMessage(chat))
}
