import { botUsername } from "@altered/core-experimental/config/app"
import { getChatConfig } from "@altered/core-experimental/config/chat"
import { createRedisState } from "@chat-adapter/state-redis"
import { Chat } from "chat"
import {
    createSendblueAdapter,
    type SendblueAdapter
} from "chat-adapter-sendblue"

type ALTEREDChat = Chat<{ sendblue: SendblueAdapter }>

let alteredChat: ALTEREDChat | undefined

function getAlteredChat(): ALTEREDChat {
    if (!alteredChat) {
        const {
            shared: {
                storage: { kv },
                providers: { sendblue }
            }
        } = getChatConfig()

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
    }

    return alteredChat
}

export { getAlteredChat }
