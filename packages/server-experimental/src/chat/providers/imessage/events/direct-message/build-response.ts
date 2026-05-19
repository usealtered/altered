import { NEW_CONVERSATION_TRIGGER_PHRASES } from "@altered/server-experimental/chat/messages/commands/definitions"
import { generateResponseFromModelMessages } from "../../../../../ai/generate/response-from-model-messages"
import { IDENTITY_SYSTEM_PROMPT } from "../../../../../ai/prompts/identity"
import { getOrCreateActiveConversationForThread } from "../../../../conversations/get-or-create-active-for-thread"
import { startNewConversationForThread } from "../../../../conversations/start-new-for-thread"
import { containsCommandTriggerPhrases } from "../../../../messages/commands/contains-trigger-phrases"
import { listChatMessagesForConversation } from "../../../../messages/list-for-conversation"
import { saveChatMessage } from "../../../../messages/save"
import { toModelMessages } from "../../../../messages/to-model-messages"
import { IMESSAGE_SYSTEM_PROMPT } from "../../behaviors/generation/prompt"
import type { ChatResponseContext } from "../../behaviors/type-and-respond"

async function buildDirectMessageResponse({
    thread,
    message
}: ChatResponseContext): Promise<string> {
    const { text: inboundMessageText } = message

    if (
        containsCommandTriggerPhrases({
            message: inboundMessageText,
            phrases: [...NEW_CONVERSATION_TRIGGER_PHRASES]
        })
    ) {
        await startNewConversationForThread({
            chatProvider: "sendblue",
            threadId: thread.id
        })

        return "Started a new conversation."
    }

    const conversation = await getOrCreateActiveConversationForThread({
        chatProvider: "sendblue",
        threadId: thread.id
    })

    await saveChatMessage({
        brainId: null,
        content: inboundMessageText,
        conversationId: conversation.id,
        role: "user",
        userId: null
    })

    const chatMessages = await listChatMessagesForConversation(conversation.id)
    const modelMessages = toModelMessages(chatMessages)

    const generatedMessageText = await generateResponseFromModelMessages(
        modelMessages,
        {
            prompts: [IDENTITY_SYSTEM_PROMPT, IMESSAGE_SYSTEM_PROMPT]
        }
    )

    await saveChatMessage({
        brainId: null,
        content: generatedMessageText,
        conversationId: conversation.id,
        role: "assistant",
        userId: null
    })

    return generatedMessageText
}

export { buildDirectMessageResponse }
