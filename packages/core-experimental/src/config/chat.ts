import { type } from "arktype"

//  TODO P0: Convert to Effect Config.

const chatConfigSchema = type({
    shared: {
        storage: {
            kv: {
                url: "string"
            }
        },
        providers: {
            sendblue: {
                public: "string",
                secret: "string",
                number: "string",
                signing: "string"
            }
        }
    }
})

type ChatConfig = typeof chatConfigSchema.infer

let chatConfig: ChatConfig | undefined

function getChatConfig(): ChatConfig {
    if (!chatConfig)
        chatConfig = chatConfigSchema.assert({
            shared: {
                storage: {
                    kv: {
                        url: process.env.SHARED_STORAGE_KV_URL
                    }
                },
                providers: {
                    sendblue: {
                        public: process.env.SHARED_PROVIDER_SENDBLUE_PUBLIC,
                        secret: process.env.SHARED_PROVIDER_SENDBLUE_SECRET,
                        number: process.env.SHARED_PROVIDER_SENDBLUE_NUMBER,
                        signing: process.env.SHARED_PROVIDER_SENDBLUE_SIGNING
                    }
                }
            }
        })

    return chatConfig
}

export { getChatConfig }
