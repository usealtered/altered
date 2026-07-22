import { ToolLoopAgent } from "ai"
import { type } from "arktype"
import { createOpenRouterChatModel } from "../../provider/create-chat-model"
import { createOrderCoffeeTool } from "./tools/order-coffee"
import { coffeeOrderingDemoToolSet } from "./tools/set"

const coffeeOrderingDemoAgentCallOptions = type({
    userId: type("string"),
    accountType: type("'free' | 'pro' | 'enterprise'"),
    complexity: type("'low' | 'medium' | 'high'"),

    memoryDepth: type("number")
})

const coffeeOrderingDemoAgent = new ToolLoopAgent({
    model: createOpenRouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),

    id: "agent-id",

    callOptionsSchema: coffeeOrderingDemoAgentCallOptions,

    tools: coffeeOrderingDemoToolSet,
    activeTools: ["order-coffee"],
    experimental_context: { test: 123 },
    toolChoice: "auto",
    prepareCall: async ({ options, ...settings }) => {
        const someAsyncSystemPromptInjection: string = await new Promise(
            resolve =>
                setTimeout(
                    () =>
                        resolve(
                            `prompt text based on ${options.accountType} and ${options.userId}`
                        ),
                    1000
                )
        )

        return {
            ...settings,
            instructions:
                settings.instructions +
                `\nUser context:
    - Account type: ${options.accountType}
    - User ID: ${options.userId}

    ${someAsyncSystemPromptInjection}
    
    Adjust your response based on the user's account level.`,

            model:
                options.complexity === "low"
                    ? createOpenRouterChatModel({
                          modelId: "openai/gpt-5.4-nano"
                      })
                    : createOpenRouterChatModel({
                          modelId: "anthropic/claude-sonnet-4.6"
                      }),

            tools: {
                ...settings.tools,

                "order-coffee": createOrderCoffeeTool({ memoryDepth: 10 })
            } as typeof settings.tools,

            messages: [
                ...(settings.messages ? settings.messages.slice(0, -1) : []),

                {
                    role: "user",
                    content: `${settings.messages?.[settings.messages.length - 1]?.content ?? ""} MODIFIED`
                }
            ]
        }
    },
    prepareStep: step => {
        // Compress conversation history for longer loops
        // if (step.messages.length > 20) {
        //     return {
        //         messages: step.messages.slice(-10)
        //     }
        // }

        // Use a stronger model for complex reasoning after initial steps
        // if (stepNumber > 2 && messages.length > 10) {
        //     return {
        //         model: yourProvider("your-model-id")
        //     }
        // }

        // Summarize tool results to reduce token usage
        // const processedMessages = messages.map(msg => {
        //     if (msg.role === "tool" && msg.content.length > 1000) {
        //         return {
        //             ...msg,
        //             content: summarizeToolResult(msg.content)
        //         }
        //     }
        //     return msg
        // })

        // return { messages: processedMessages }

        // Search phase (steps 0-2)
        // if (step.stepNumber <= 2) {
        //     return {
        //         toolChoice: { type: "tool", toolName: "search" }
        //     }
        // }

        // Summary phase (step 6+)
        // return {
        //     activeTools: ["summarize"],
        //     toolChoice: "required"
        // }

        console.log(step)

        return {}
    },
    onStepFinish: step => {
        console.log(step)
    },
    // stopWhen: stepCountIs(2),
    stopWhen: ({ steps }) => steps.length === 2,
    instructions: [
        "You detect explicit coffee-order requests and either call the orderCoffee tool or output none.",
        "If the user clearly asks to order coffee, call orderCoffee exactly once.",
        "Pass type when explicitly provided; omit type when not provided.",
        "If this is not an explicit coffee-order request, do not call tools and respond with exactly: none",
        "After a successful tool call, respond with exactly one short confirmation sentence similar to: Got it. Your latte was successfully ordered."
    ].join("\n")
})

export { coffeeOrderingDemoAgent }
