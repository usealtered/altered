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
            state: createRedisState({ url: kv.url }),
            userName: botUsername
        })

        registerImessageChatEventHandlers(alteredChat)
    }

    return alteredChat
}

export { type ALTEREDChat, getAlteredChat }
