import { languageModelIds } from "@altered/core-experimental/config/ai"
import { tool } from "ai"
import { type } from "arktype"

const modelIdSchema = type("===", ...languageModelIds).describe(
    "The language model ID to change to."
)

function createChangeModelTool() {
    return tool({
        title: "Change Model",
        description:
            "Change the language model that should be used for the conversation.",

        inputSchema: type({
            id: modelIdSchema
        }),

        outputSchema: type({
            success: type("boolean").describe(
                "Whether the operation was successful."
            )
        }),

        execute: ({ id }) => {
            console.log(`[WIP] Requested model change to ID: ${id}`)

            return {
                success: true
            }
        }
    })
}

export { createChangeModelTool }
