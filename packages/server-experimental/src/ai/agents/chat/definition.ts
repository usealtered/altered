import type { AssertExactMatch } from "@altered/core-experimental/typescript/exact-match"
import {
    type ModelMessage,
    type SystemModelMessage,
    systemModelMessageSchema,
    ToolLoopAgent,
    type ToolLoopAgentSettings
} from "ai"
import { type } from "arktype"
import { createTextTemplate } from "../../prompts/create-text-template"
import { createOpenrouterChatModel } from "../../provider/create-chat-model"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../../provider/metadata"
import { resolveAgentInstructions } from "../utils/resolve-agent-instructions"
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

const agentInstructionsSchema = type("string")
    .or(type(systemModelMessageSchema).as<SystemModelMessage>())
    .or(type(systemModelMessageSchema.array()).as<SystemModelMessage[]>())
    .or("undefined")

const _agentInstructionsSchemaIntegrityCheck: AssertExactMatch<
    typeof agentInstructionsSchema.infer,
    ToolLoopAgentSettings["instructions"]
> = true

const chatAgentCallOptionsSchema = type({
    "config?": {
        "systemPrompt?": agentInstructionsSchema,

        /**
         * @todo P3: See note on 2026-06-20 titled "Chat Agent Channel Discrimination" and evaluate.
         */
        channel: {
            type: "'direct'",
            provider: "'imessage'"
        },

        "allowAdminTools?": "boolean",

        "experimental_usePseudocodeWorkflowInstructions?": "boolean"
    },

    context: chatAgentContextSchema
})

const WORKFLOW_INSTRUCTIONS_PART = `

# Workflow

1. Query memory: always call the \`query-memory\` tool **at least once**. If the query reveals areas to expand on, call the tool again. Repeat until satisfied.

2. Handle actionable intent: if the user's message implies actionable intent, call the appropriate tool for each intent. Repeat until all intents are handled.

3. Distill message: distill the user's latest message.

4. Respond: generate a final response to the user's message.

`

const WORKFLOW_PSEUDOCODE_INSTRUCTIONS_PART = `

# Workflow

\`\`\`pseudocode
{
    queryMemory()
} while (not satisfied)

if (actionable intents) {
    for (const intent of actionable intents) {
        callTool()
    }
}

distillMessage(latestUserMessage)

generateResponse()
\`\`\`

`

const ADMIN_TOOLS_INSTRUCTIONS_PART = `

## Admin Tools

**NOTE:** These tools are only available to ALTERED internal team members, and are conditionally provided.

- [WIP] Change application target (\`change-application-target\`): Configure the ALTERED deployment that requests should be forwarded to.

- [WIP] Change model (\`change-model\`): Update the model ID used for the conversation.

- [WIP] Reindex conversation (\`reindex-conversation\`): Re-distill all conversation messages. Useful for renewing memory after algorithm changes.

- [WIP] Schedule message (\`schedule-message\`): Schedule a time & intent for revisiting the conversation.

`

/**
 * @todo P2: Consider whether this is the best format. XML-style or an agent skill may be better suited.
 *
 * @todo P2: Look into whether we should provide the agent tools for messaging, such as sending read receipts, typing indicators, intermediary messages, etc. or if this should all be done programmatically based on the generated text response.
 */
const CHAT_AGENT_INSTRUCTIONS_TEMPLATE = `

# Identity and Purpose

You are Koa (Knowledge Orchestration Agent), the top-level chat agent for ALTERED. Your role is to read & respond to user messages across messaging channels, taking action where necessary.

# Capabilities

## System

- [WIP] Send status update (\`send-status-update\`): Send the user a short summary about the state of intermediary tasks before responding.

## Memory

- [WIP] Query memory (\`query-memory\`): Get more context about the conversation and the user. Uses an algorithm to fetch all relevant thoughts from the database.

- [WIP] Distill message (\`distill-message\`): Distill a message from the conversation. Transforms raw, lengthy text content into individual, indexed thoughts.

{{adminToolsInstructionsPart}}

{{workflowInstructionsPart}}

`

const chatAgentInstructionsTemplate = createTextTemplate({
    template: CHAT_AGENT_INSTRUCTIONS_TEMPLATE,

    variables: {
        schemas: {
            adminToolsInstructionsPart: type("boolean | undefined").pipe(
                shouldFill =>
                    shouldFill === true ? ADMIN_TOOLS_INSTRUCTIONS_PART : null
            ),

            workflowInstructionsPart: type("string")
        },

        options: {
            adminToolsInstructionsPart: { whitespace: "pad" },
            workflowInstructionsPart: { whitespace: "pad" }
        }
    }
})

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
        const instructions = chatAgentInstructionsTemplate.fill({
            adminToolsInstructionsPart: config?.allowAdminTools === true,

            workflowInstructionsPart:
                config?.experimental_usePseudocodeWorkflowInstructions === true
                    ? WORKFLOW_PSEUDOCODE_INSTRUCTIONS_PART
                    : WORKFLOW_INSTRUCTIONS_PART
        })

        /**
         * @remarks Simulates an async call until we have something actually async to use.
         */
        const resolvedInstructions = await new Promise<string>(resolve =>
            setTimeout(() => resolve(instructions), 1500)
        )

        const combinedInstructions = [
            ...resolveAgentInstructions(config?.systemPrompt),

            ...resolveAgentInstructions(resolvedInstructions)
        ]

        //  Demonstrates modifying the message history before generating. We could potentially move the ephemeral system prompt injection here.

        const previousMessages = params.messages?.slice(0, -1)
        const lastMessage = params.messages?.at(-1)

        const modifiedMessages = params.messages
            ? [
                  ...(previousMessages ? previousMessages : []),

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
                config?.allowAdminTools === true
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
            `Step cost: ${formatOpenRouterCost(parseOpenrouterProviderMetadata(step.providerMetadata)?.openrouter?.usage?.cost)}`
        )

        //  We may want to consider performing message history storage here for storing results, if appropriate, as well as logging metrics.
    },

    instructions:
        "These system instructions should be entirely overridden. Please indicate a technical error to the user and ask them to report it to the developer."
})

export {
    agentInstructionsSchema,
    chatAgent,
    chatAgentCallOptionsSchema,
    chatAgentContextSchema
}
