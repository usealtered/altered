import { tool } from "ai"
import { type } from "arktype"
import { chatAgentContextSchema } from "../definition"

function createDistillMessageTool(options?: {
    expandKeywordGeneration?: {
        iterations?: number
    }
}) {
    const { expandKeywordGeneration: _expandKeywordGeneration } = {
        ...(options ?? {}),

        expandKeywordGeneration: {
            iterations: options?.expandKeywordGeneration?.iterations ?? 1
        }
    }

    return tool({
        title: "Distill Message",
        description:
            "Distill a message from the conversation. Transforms raw, lengthy text content into individual, indexed thoughts.",

        type: "function",
        strict: true,

        inputSchema: type({
            id: type("string").describe("The ID of the message to distill.")
        }),

        /**
         * @remarks See notes on 2026-06-22 about "Distillation Tool Output Schema".
         */
        outputSchema: type({
            thoughtCount: type("number").describe(
                "The number of thoughts that were distilled from the message."
            ),

            cost: type("string").describe(
                "The cost of the distillation process in USD."
            )
        }),

        execute: async (
            query,

            {
                toolCallId: _toolCallId,
                messages: _messages,
                experimental_context,
                abortSignal: _abortSignal
            }
        ) => {
            const { user: _user } =
                chatAgentContextSchema.assert(experimental_context)

            //  THE FOLLOWING IS A ROUGH-IN FOR A MULTI-PART DISTILLATION HANDLER. We will likely refactor this into a reusable function, which will be implemented in the `reindex-conversation` tool. For now, it exists here.

            const sourceTextItems: { id: string; content: string }[] = [
                {
                    id: query.id,
                    content: "Placeholder message content."
                }
            ]

            const distillationJobs = sourceTextItems.map(
                //  This distillation algorithm could be encapsulated in a separate function.

                async _sourceTextItem => {
                    //  SUBJECT TO THE STEPS THAT WILL BE DEFINED IN OUR DISTILLATION PLAN. See notes on 2026-06-22 about "Summary of Distillation Process".

                    //  Placeholder delay for subagent calls.

                    await new Promise(resolve => setTimeout(resolve, 1500))

                    return {
                        thoughtIds: Array.from({
                            length: Math.floor(Math.random() * 10) + 1
                        }).map((_, index) => `placeholder-thought-id-${index}`),

                        cost: 0.001
                    }
                }
            )

            const jobResults = await Promise.allSettled(distillationJobs)

            for (const jobResult of jobResults)
                if (jobResult.status === "rejected")
                    console.error(
                        `[WIP] Distillation job failed: ${jobResult.reason}`
                    )

            const successfulJobResults = jobResults.filter(
                jobResult => jobResult.status === "fulfilled"
            )

            const thoughtCount = successfulJobResults.reduce(
                (acc, jobResult) => acc + jobResult.value.thoughtIds.length,
                0
            )

            const totalCost = successfulJobResults.reduce(
                (acc, jobResult) => acc + jobResult.value.cost,
                0
            )

            return {
                thoughtCount,

                cost: `$${totalCost.toFixed(4)} USD`
            }
        }
    })
}

export { createDistillMessageTool }
