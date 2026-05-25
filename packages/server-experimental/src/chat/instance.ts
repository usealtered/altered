import { botUsername } from "@altered/core-experimental/config/app"
import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import { createRedisState } from "@chat-adapter/state-redis"
import { Chat } from "chat"
import {
    createSendblueAdapter,
    type SendblueAdapter
} from "chat-adapter-sendblue"
import { registerImessageChatEventHandlers } from "./providers/imessage/events/registrar"

/**
 * @remarks Consider renaming to `Chat`.
 */
type ALTEREDChat = Chat<{ sendblue: SendblueAdapter }>

let alteredChat: ALTEREDChat | undefined

function getAlteredChat(): ALTEREDChat {
    if (!alteredChat) {
        const {
            shared: {
                storage: { kv },
                providers: { sendblue }
            }
        } = getEnvironmentConfig()

        alteredChat = new Chat({
            adapters: {
                sendblue: createSendblueAdapter({
                    apiKey: sendblue.public,
                    apiSecret: sendblue.secret,
                    defaultFromNumber: sendblue.number,
                    webhookSecret: sendblue.signing
                })
            },

            /**
             * @todo P3: Consider passing the Upstash Redis client directly and removing the TCP connection URL environment variable. Upstash claims that their HTTP client is more reliable for serverless.
             */
            state: createRedisState({ url: kv.url }),
            userName: botUsername
        })

        registerImessageChatEventHandlers(alteredChat)
    }

    return alteredChat
}

/**
 * For stateful usage outside of webhooks. Ensures that the chat is initialized and that Redis is connected.
 *
 * @remarks Necessary for absolute durability. The adapter does not reconnect if the connection drops.
 */
async function initializeAlteredChat(): Promise<ALTEREDChat> {
    const chat = getAlteredChat()

    await chat.initialize()

    const state = chat.getState()
    await state.connect()

    return chat
}

export { type ALTEREDChat, getAlteredChat, initializeAlteredChat }
