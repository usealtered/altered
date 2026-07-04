import {
    type ModelMessage,
    type SystemModelMessage,
    systemModelMessageSchema,
    ToolLoopAgent
} from "ai"
import { type } from "arktype"
import type { prepareMessagesForGeneration } from "../../generate/prepare-messages"
import { createOpenrouterChatModel } from "../../provider/create-chat-model"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../../provider/metadata"
import { resolveAgentInstructions } from "../utils/resolve-agent-instructions"
import {
    createChatAgentEphemeralInstructions,
    createChatAgentInstructions
} from "./instructions/composition"
import {
    chatAdminToolNames,
    chatAdminToolSet,
    chatToolNames,
    chatToolSet
} from "./tools/set"

const chatAgentId = "chat" as const

const chatAgentContextSchema = type({
    /**
     * @remarks FOR DEMONSTRATION ONLY. May change later.
     */
    user: {
        phoneNumber: type("string"),

        planId: type("'paid' | 'free'")
    }
})

const systemMessagesSchema = type(systemModelMessageSchema)
    .array()
    .as<SystemModelMessage[]>()

const conversationChannelSchema = type({
    type: "'direct'",
    provider: "'imessage'"
})

type ConversationChannel = typeof conversationChannelSchema.infer

const chatAgentCallOptionsSchema = type({
    config: {
        "systemMessages?": systemMessagesSchema,

        /**
         * @todo P3: See note on 2026-06-20 titled "Chat Agent Channel Discrimination" and evaluate.
         */
        channel: conversationChannelSchema,

        "enableAdminTools?": "boolean",

        "experimental_usePseudocodeWorkflowInstructions?": "boolean"
    },

    context: chatAgentContextSchema
})

type ChatAgentCallOptions = typeof chatAgentCallOptionsSchema.infer

const chatAgent = new ToolLoopAgent({
    id: chatAgentId,

    model: createOpenrouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),

    tools: { ...chatToolSet, ...chatAdminToolSet },
    activeTools: [...chatToolNames],
    toolChoice: "auto",
    experimental_context: null,

    callOptionsSchema: chatAgentCallOptionsSchema,

    prepareCall: async ({ options: { config, context }, ...params }) => {
        const instructions = createChatAgentInstructions({
            channel: config.channel,

            includeAdminTools: config.enableAdminTools === true,

            experimental_usePseudocodeWorkflowInstructions:
                config.experimental_usePseudocodeWorkflowInstructions
        })

        /**
         * @remarks Simulates an async call until we have something actually async to use.
         */
        const resolvedInstructions = await new Promise<string>(resolve =>
            setTimeout(() => resolve(instructions), 1500)
        )

        const combinedInstructions = [
            ...(config?.systemMessages ?? []),

            ...resolveAgentInstructions(resolvedInstructions)
        ]

        const previousMessages = params.messages?.slice(0, -1)
        const lastMessage = params.messages?.at(-1)

        /**
         * @todo P0: Consider whether we should handle more advanced message composition edge cases for the ephemeral prompt injection, like we do in {@link prepareMessagesForGeneration}.
         *
         * @todo P1: Consider changing the ephemeral prompt to use the `system` role.
         */
        const modifiedMessages = params.messages
            ? [
                  ...(previousMessages ? previousMessages : []),

                  {
                      role: "user",
                      content: createChatAgentEphemeralInstructions()
                  } as ModelMessage,

                  ...(lastMessage
                      ? [
                            {
                                ...lastMessage,

                                content: lastMessage.content
                            } as ModelMessage
                        ]
                      : [])
              ]
            : undefined

        return {
            ...params,

            model: createOpenrouterChatModel({
                modelId:
                    context.user.planId === "paid"
                        ? "anthropic/claude-sonnet-4.6"
                        : "openai/gpt-5.4-nano"
            }),

            tools: {
                ...params.tools

                //  If we wanted to recreate or modify a tool definition before generating (e.g., to change the way the messages are returned in `toModelOutput`), we could do so here.
            } as typeof params.tools,

            activeTools:
                config?.enableAdminTools === true
                    ? [...(params.activeTools ?? []), ...chatAdminToolNames]
                    : params.activeTools,

            experimental_context: context,

            instructions: combinedInstructions,

            messages: modifiedMessages
        }
    },

    prepareStep: ({ messages, stepNumber, ..._params }) => {
        //  Example of how we could truncate messages based on the message count within longer conversations, where the history may not be relevant. This could also be done based on tokens.

        // if (messages.length > 20) return { messages: messages.slice(-10) }

        //  Always query memory that exists outside of the conversation on every turn for chat agents. This could alternatively be done in `prepareCall`, and inserted into the instructions, or into the messages array as an ephemeral system prompt.

        //  See note on 2026-06-22 titled "Memory Injection Placement & Agent Authority".

        if (stepNumber === 0)
            return {
                activeTools: ["query-memory"],

                toolChoice: { type: "tool", toolName: "query-memory" }
            }
    },

    /**
     * @remarks Simple hard limit to prevent runaway loops. Can be adjusted in the future.
     */
    stopWhen: ({ steps }) => steps.length === 25,

    onStepFinish: step => {
        console.log(
            `[ai:agents:chat] Step cost: ${formatOpenRouterCost(parseOpenrouterProviderMetadata(step.providerMetadata)?.openrouter?.usage?.cost)}`
        )

        //  We may want to consider performing message history storage here for storing results, if appropriate, as well as logging metrics.
    },

    instructions:
        "These system instructions should be entirely overridden. Please indicate a technical error to the user and ask them to report it to the developer."
})

export {
    type ChatAgentCallOptions,
    type ConversationChannel,
    chatAgent,
    chatAgentCallOptionsSchema,
    chatAgentContextSchema,
    systemMessagesSchema
}
