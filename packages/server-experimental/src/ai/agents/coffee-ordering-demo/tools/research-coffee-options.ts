import { stepCountIs, ToolLoopAgent, tool } from "ai"
import { type } from "arktype"
import { createOpenRouterChatModel } from "../../../provider/create-chat-model"
import { createOrderCoffeeTool } from "./order-coffee"

// Define a subagent for research tasks
const researchSubagent = new ToolLoopAgent({
    model: createOpenRouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),
    instructions: `You are a research agent. Complete the task autonomously.

IMPORTANT: When you have finished, write a clear summary of your findings as your final response.
This summary will be returned to the main agent, so include all relevant information.`,
    tools: {
        read: createOrderCoffeeTool({ memoryDepth: 10 }) // defined elsewhere
    },
    stopWhen: stepCountIs(2)
})

// Create a tool that delegates to the subagent

/*

import Terminal from '@terminaldotshop/sdk';

const client = new Terminal();

const products = await client.product.list();

console.log(products.data);

OR use browser use for starbucks menu
*/
const researchCoffeeOptionsTool = tool({
    description: "Research a topic or question in depth.",
    inputSchema: type({
        task: type("string").describe("The research task to complete")
    }),
    execute: async ({ task }, { abortSignal }) => {
        const result = await researchSubagent.generate({
            prompt: task,
            abortSignal
        })
        return result.content
    },

    // outputSchema: v,
    toModelOutput: ({ output: message }) => {
        // Extract just the final text as a summary
        const lastTextPart = message?.findLast(p => p.type === "text")

        return {
            type: "text",
            value: lastTextPart?.text ?? "No summary found."
        }
    }
})

export { researchCoffeeOptionsTool }
