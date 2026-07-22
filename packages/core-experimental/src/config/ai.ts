const modelVendorIds = [
    "anthropic",
    "openai",
    "google",
    "deepseek",
    "tencent"
] as const

type ModelVendorID = (typeof modelVendorIds)[number]

const modelVendorDefinitions = {
    anthropic: { id: "anthropic", name: "Anthropic" },
    openai: { id: "openai", name: "OpenAI" },
    google: { id: "google", name: "Google" },
    deepseek: { id: "deepseek", name: "DeepSeek" },
    tencent: { id: "tencent", name: "Tencent" }
} as const satisfies Record<ModelVendorID, { id: ModelVendorID; name: string }>

const modelVendorNames = Object.values(modelVendorDefinitions).map(v => v.name)
type ModelVendorName = (typeof modelVendorNames)[number]

/**
 * @remarks See note on 2026-06-02 titled "Model Presets and Task Definitions" for further development plans for deriving internal model IDs.
 */
const languageModelIds = [
    "anthropic/claude-sonnet-4.6",

    "openai/gpt-5.4-nano",

    "google/gemini-3.1-flash-lite",

    "deepseek/deepseek-v4-flash",

    "tencent/hy3-preview"
] as const satisfies `${ModelVendorID}/${string}`[]

type LanguageModelID = (typeof languageModelIds)[number]

/**
 * @remarks Providers often have multiple regions. If we need to lock to a region, we can add region configuration support.
 */
const inferenceProviderIds = [
    "anthropic",
    "openai",

    "amazon-bedrock",
    "google-vertex"
] as const

type InferenceProviderID = (typeof inferenceProviderIds)[number]

const languageModelModalities = [
    "text",
    "image",
    "file",
    "audio",
    "video"
] as const

type LanguageModelModality = (typeof languageModelModalities)[number]

type LanguageModelDefinition = {
    id: LanguageModelID
    vendorId: ModelVendorID

    name: string
    vendorName: ModelVendorName

    inferenceProviders: InferenceProviderID[]

    modalities: {
        input: LanguageModelModality[]
        output: LanguageModelModality[]
    }

    contextLimits: {
        totalTokens: number
        outputTokens: number
    }

    /**
     * All cost metrics are the price per million tokens in USD.
     *
     * @todo P2: We should improve this model to better structure all price variants.
     *
     * @remarks These metrics are only for configuration reference, and should NOT be used for billing - read the OpenRouter provider metadata on each generation to get the actual usage.
     */
    cost: {
        input: number
        output: number

        cache: {
            read: number
            write: number | Record<string, unknown>[] | null
        } | null
    }
}

/**
 * @todo P2: Do AI research to see if there's an SDK (e.g. OpenRouter) that provides all of these, and keeps them up to date.
 *
 * @remarks Some properties are not exhaustive, and are added as needed.
 */
const languageModelDefinitions = {
    "anthropic/claude-sonnet-4.6": {
        id: "anthropic/claude-sonnet-4.6",
        vendorId: "anthropic",

        name: "Claude Sonnet 4.6",
        vendorName: "Anthropic",

        inferenceProviders: ["anthropic"],

        modalities: {
            input: ["text", "image", "file"],
            output: ["text"]
        },

        contextLimits: {
            totalTokens: 1_000_000,
            outputTokens: 128_000
        },

        cost: {
            input: 3,
            output: 15,

            cache: {
                read: 0.3,
                write: [
                    {
                        ttl: "5m",
                        cost: 3.75
                    },
                    {
                        ttl: "1h",
                        cost: 6
                    }
                ]
            }
        }
    },

    "openai/gpt-5.4-nano": {
        id: "openai/gpt-5.4-nano",
        vendorId: "openai",

        name: "GPT-5.4 Nano",
        vendorName: "OpenAI",

        inferenceProviders: ["openai"],

        modalities: {
            input: ["text", "image", "file"],
            output: ["text"]
        },

        contextLimits: {
            totalTokens: 400_000,
            outputTokens: 128_000
        },

        cost: {
            input: 0.2,
            output: 1.25,

            cache: {
                read: 0.02,
                write: null
            }
        }
    },

    "google/gemini-3.1-flash-lite": {
        id: "google/gemini-3.1-flash-lite",
        vendorId: "google",

        name: "Gemini 3.1 Flash Lite",
        vendorName: "Google",

        inferenceProviders: ["google-vertex"],

        modalities: {
            input: ["text", "image", "file", "audio", "video"],
            output: ["text"]
        },

        contextLimits: {
            totalTokens: 1_050_000,
            outputTokens: 65_500
        },

        /**
         * @remarks Has additional pricing for audio input, audio caching, and web search that is not specified here. See https://openrouter.ai/google/gemini-3.1-flash-lite and https://ai.google.dev/gemini-api/docs/pricing#gemini-3.1-flash-lite.
         */
        cost: {
            input: 0.25,
            output: 1.5,

            cache: {
                read: 0.025,
                write: 0.083_33
            }
        }
    },

    "deepseek/deepseek-v4-flash": {
        id: "deepseek/deepseek-v4-flash",
        vendorId: "deepseek",

        name: "DeepSeek V4 Flash",
        vendorName: "DeepSeek",

        inferenceProviders: [],

        modalities: {
            input: ["text"],
            output: ["text"]
        },

        contextLimits: {
            totalTokens: 1_050_000,
            outputTokens: 131_100
        },

        cost: {
            input: 0.0983,
            output: 0.1966,

            cache: {
                read: 0.0197,
                write: null
            }
        }
    },

    "tencent/hy3-preview": {
        id: "tencent/hy3-preview",
        vendorId: "tencent",

        name: "Hy3 Preview",
        vendorName: "Tencent",

        inferenceProviders: [],

        modalities: {
            input: ["text"],
            output: ["text"]
        },

        contextLimits: {
            totalTokens: 262_100,
            outputTokens: 262_100
        },

        cost: {
            input: 0.063,
            output: 0.21,

            cache: {
                read: 0.021,
                write: null
            }
        }
    }
} as const satisfies Record<LanguageModelID, LanguageModelDefinition>

type LanguageModelConfiguration = {
    id: LanguageModelID

    isEnabled: boolean

    /**
     * If null, all inference providers are allowed.
     */
    allowedInferenceProviders: InferenceProviderID[] | null

    /**
     * @remarks `null` values mean that the rating is either not yet calculated or available to use. Inspired by Raycast's model display card.
     */
    ratings: {
        speed: number | null
        intelligence: number | null
        cost: number | null
    }
}

const languageModelConfigurations = {
    "anthropic/claude-sonnet-4.6": {
        id: "anthropic/claude-sonnet-4.6",

        isEnabled: true,

        allowedInferenceProviders: ["anthropic"],

        ratings: {
            speed: null,
            intelligence: null,
            cost: null
        }
    },

    "openai/gpt-5.4-nano": {
        id: "openai/gpt-5.4-nano",

        isEnabled: true,

        allowedInferenceProviders: null,

        ratings: {
            speed: null,
            intelligence: null,
            cost: null
        }
    },

    "google/gemini-3.1-flash-lite": {
        id: "google/gemini-3.1-flash-lite",

        isEnabled: true,

        allowedInferenceProviders: null,

        ratings: {
            speed: null,
            intelligence: null,
            cost: null
        }
    },

    "deepseek/deepseek-v4-flash": {
        id: "deepseek/deepseek-v4-flash",

        isEnabled: true,

        allowedInferenceProviders: null,

        ratings: {
            speed: null,
            intelligence: null,
            cost: null
        }
    },

    "tencent/hy3-preview": {
        id: "tencent/hy3-preview",

        isEnabled: true,

        allowedInferenceProviders: null,

        ratings: {
            speed: null,
            intelligence: null,
            cost: null
        }
    }
} satisfies Record<LanguageModelID, LanguageModelConfiguration>

export {
    type LanguageModelID,
    languageModelConfigurations,
    languageModelDefinitions,
    languageModelIds
}
