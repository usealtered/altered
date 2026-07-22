import { tool } from "ai"
import { type } from "arktype"

function createOrderCoffeeTool({
    memoryDepth: _memoryDepth
}: {
    memoryDepth: number
}) {
    return tool({
        title: "Order Coffee",
        outputSchema: type({
            orderNumber: type("number").describe("The order number"),
            success: type("boolean").describe(
                "Whether the order was successful"
            )
        }),
        strict: true,
        type: "function",
        description: "Mock internal tool to place a coffee order for the user.",
        inputSchema: type({
            "name?": type("string").describe("The name of the customer"),

            "type?": type("string").describe("The type of coffee to order")
        }),
        inputExamples: [
            { input: { type: "latte" } },
            { input: { type: "mocha" } }
        ],

        execute: async (
            { type: _type },
            { toolCallId, messages: _messages, experimental_context: context }
        ) => {
            const resolvedContext = context as { test: number }

            console.log(toolCallId, resolvedContext)

            await new Promise(resolve => setTimeout(resolve, 1000))

            return {
                orderNumber: 1_234_567_890,
                success: true
            }
        }
    })
}

export { createOrderCoffeeTool }
