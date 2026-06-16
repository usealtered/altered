import {
    type ModelMessage,
    type SystemModelMessage,
    systemModelMessageSchema,
    ToolLoopAgent
} from "ai"
import { type } from "arktype"
import { createTemplatedText } from "../../prompts/create-templated-text"
import { createOpenrouterChatModel } from "../../provider/create-chat-model"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../../provider/metadata"
import { resolveAgentInstructions } from "../utils/resolve-agent-instructions"
import { coffeeOrderingDemoToolSet } from "./tools/set"

const coffeeOrderingDemoAgentId = "coffee-ordering-demo" as const

const validateCoffeeOrderingDemoAgentContext = type({
    /**
     * @remarks For demonstration - may be changed later.
     */
    user: {
        phoneNumber: type("string"),

        planId: type("'paid' | 'free'")
    }
})

const validateCoffeeOrderingDemoAgentCallOptions = type({
    "config?": {
        "systemPrompt?": type("string")
            .or(type(systemModelMessageSchema).as<SystemModelMessage>())
            .or(
                type(systemModelMessageSchema.array()).as<
                    SystemModelMessage[]
                >()
            ),

        "explicitlySkipOrderingCoffee?": type("boolean")
    },

    context: validateCoffeeOrderingDemoAgentContext
})

const IMPLICITLY_SKIP_ORDERING_COFFEE_INSTRUCTION_PART =
    "\n\nIf the user does not signal intent, you can dismiss these instructions and respond normally." as const

const EXPLICITLY_SKIP_ORDERING_COFFEE_INSTRUCTION_PART =
    "\n\n- If you interpret that the user does not want to order coffee, call the `skip-ordering-coffee` tool exactly once." as const

/**
 * @todo P2: Consider whether this is the best prompt format. Instructions may be a bit verbose.
 */
const COFFEE_ORDERING_DEMO_AGENT_INSTRUCTIONS_TEMPLATE =
    `<coffee_ordering_instructions>
First, you will always call the \`query-memory\` tool exactly once to get more information about the conversation.

Your job is to interpret an incoming iMessage and the associated conversation history, and determine whether there is implicit or explicit intent to trigger an action related to ordering coffee.{{implicitlySkipOrderingCoffeeInstructionPart}}

<user_context>
Consider the user's information when placing a coffee order:

- Phone number: {{phoneNumber}}
</user_context>

<tool_usage>
- If you interpret that the user is not confident in what they want to order OR that they want to explore options, call the \`research-coffee-options\` tool exactly once.

- If you interpret that the user wants to order coffee AND that they are confident in what they want to order, call the \`order-coffee\` tool exactly once.

- If the user requests a specific type of coffee, mention the type as a parameter when calling the tool. Otherwise, omit the parameter.{{explicitlySkipOrderingCoffeeInstructionPart}}
</tool_usage>

<response>
- After researching coffee options, always respond with a brief summary.

- After ordering coffee, always respond with a brief confirmation.
</response>
</coffee_ordering_instructions>` as const

const coffeeOrderingDemoAgent = new ToolLoopAgent({
    id: coffeeOrderingDemoAgentId,

    model: createOpenrouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),

    tools: coffeeOrderingDemoToolSet,
    activeTools: ["research-coffee-options", "order-coffee"],
    toolChoice: "auto",
    experimental_context: null,

    callOptionsSchema: validateCoffeeOrderingDemoAgentCallOptions,

    prepareCall: async ({ options: callOptions, ...params }) => {
        /**
         * @remarks Simulates an async call, until we have something actually async to use.
         */
        const resolvedInstructions = await new Promise<string>(resolve =>
            setTimeout(
                () =>
                    resolve(
                        createTemplatedText(
                            COFFEE_ORDERING_DEMO_AGENT_INSTRUCTIONS_TEMPLATE,
                            {
                                phoneNumber:
                                    callOptions.context.user.phoneNumber,

                                implicitlySkipOrderingCoffeeInstructionPart:
                                    callOptions.config
                                        ?.explicitlySkipOrderingCoffee
                                        ? ""
                                        : IMPLICITLY_SKIP_ORDERING_COFFEE_INSTRUCTION_PART,

                                explicitlySkipOrderingCoffeeInstructionPart:
                                    callOptions.config
                                        ?.explicitlySkipOrderingCoffee
                                        ? EXPLICITLY_SKIP_ORDERING_COFFEE_INSTRUCTION_PART
                                        : ""
                            }
                        )
                    ),
                1000
            )
        )

        const combinedInstructions = [
            ...resolveAgentInstructions(callOptions.config?.systemPrompt),

            ...resolveAgentInstructions(resolvedInstructions)
        ]

        const previousMessages = params.messages?.slice(0, -1)
        const lastMessage = params.messages?.at(-1)

        const modifiedMessages = params.messages
            ? [
                  ...(previousMessages ? previousMessages : []),

                  //  Demonstrates modifying the message history before generating. We could potentially move the ephemeral system prompt injection here.

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
                    callOptions.context.user.planId === "paid"
                        ? "anthropic/claude-sonnet-4.6"
                        : "openai/gpt-5.4-nano"
            }),

            tools: {
                ...params.tools

                //  If we wanted to recreate or modify a tool definition before generating (e.g., to change the way the messages are returned in `toModelOutput`), we could do so here.
            } as typeof params.tools,

            activeTools: callOptions.config?.explicitlySkipOrderingCoffee
                ? [...(params.activeTools ?? []), "skip-ordering-coffee"]
                : params.activeTools,

            experimental_context: callOptions.context,

            instructions: combinedInstructions,

            messages: modifiedMessages
        }
    },

    prepareStep: ({ messages, stepNumber, ..._params }) => {
        //  Example of how to truncate messages based on message length during longer tool loops, where the history may not be relevant. This could also be done based on token count.

        if (messages.length > 20) return { messages: messages.slice(-10) }

        //  Always query memory that exists outside of the conversation on every turn for chat agents. This could alternatively be done in `prepareCall`, and inserted into the instructions, or into the messages array as an ephemeral system prompt.

        if (stepNumber === 0)
            return {
                activeTools: ["query-memory"],

                toolChoice: { type: "tool", toolName: "query-memory" }
            }
    },

    /**
     * @remarks A standard execution should run a memory query step, one of the tool pathways, and then generate a response. That makes 3 steps a reasonable hard limit.
     */
    stopWhen: ({ steps }) => steps.length === 3,

    onStepFinish: step => {
        console.log(
            `Step cost: ${formatOpenRouterCost(parseOpenrouterProviderMetadata(step.providerMetadata)?.openrouter?.usage?.cost)}`
        )

        //  We may want to consider embedding message history storage here for partial result saving, if feasible.
    },

    instructions:
        "These system instructions should be entirely overridden. Please indicate a technical error to the user and ask them to report it to the developer."
})

export {
    coffeeOrderingDemoAgent,
    coffeeOrderingDemoAgentId,
    validateCoffeeOrderingDemoAgentCallOptions,
    validateCoffeeOrderingDemoAgentContext
}
