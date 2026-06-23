import { tool } from "ai"
import { type } from "arktype"
import { chatAgentContextSchema } from "../definition"

function createQueryMemoryTool(options?: {
    include?: {
        brains?: {
            user?: boolean
            system?: boolean
        }
    }
}) {
    const { include } = {
        ...(options ?? {}),

        include: {
            brains: {
                user: options?.include?.brains?.user ?? true,
                system: options?.include?.brains?.system ?? true
            }
        }
    }

    return tool({
        title: "Query Memory",
        description:
            "Get more context about the conversation and the user. Uses an algorithm to fetch all relevant thoughts from the database.",

        type: "function",
        strict: true,

        inputSchema: type({
            context: type("string").describe(
                "A detailed description about the current conversation topic, scope, and intent."
            ),

            "questions?": type("string")
                .array()
                .describe("A list of questions about the current conversation.")
        }),

        outputSchema: type({
            thoughts: type({
                id: type("string").describe("The unique ID of the thought."),

                content: type("string").describe(
                    "The description of the thought."
                ),
                alias: type("string").describe("The title of the thought."),

                createdAt: type("string").describe(
                    "The timestamp of the creation of the thought."
                ),
                updatedAt: type("string").describe(
                    "The timestamp of the last update of the thought."
                ),

                datasets: type({
                    id: type("string").describe(
                        "The unique ID of the dataset."
                    ),

                    content: type("string").describe(
                        "The description of the dataset."
                    ),
                    alias: type("string").describe("The title of the dataset."),

                    createdAt: type("string").describe(
                        "The timestamp of the creation of the dataset."
                    ),
                    updatedAt: type("string").describe(
                        "The timestamp of the last update of the dataset."
                    )
                })
                    .array()
                    .describe("The datasets the thought is tagged with.")
            })
                .array()
                .describe("The thoughts found in the database.")
        }),

        inputExamples: [
            {
                input: {
                    context:
                        "Riley is planning a trip to Miami in the coming months to attend Ultra Music Festival with some local and online friends. Riley plans on exploring the city and surrounding area for work opportunities, living amenities, and to experience the lifestyle there.",

                    questions: [
                        "Who are Riley's friends?",
                        "Has Riley gone on any similar trips in the past?",
                        "What kind of interests might Riley seek out on a trip like this?"
                    ]
                }
            }
        ],

        execute: async (
            query,

            { toolCallId, messages: _messages, experimental_context }
        ) => {
            const { user } = chatAgentContextSchema.assert(experimental_context)

            console.log(`[WIP] Tool call ID: ${toolCallId}`)

            console.log("[WIP] Requested to query memory:", {
                options,
                user,
                query
            })

            //  Placeholder async call to simulate a network request or subagent generation.

            await new Promise(resolve => setTimeout(resolve, 1500))

            return {
                thoughts: [
                    include.brains.user
                        ? {
                              id: "1",

                              content:
                                  "This is a user-level thought from Riley's ALTERED brain (manually inserted). Act as if you found memories about a previous trip to Miami to attend Ultra Music Festival in 2024 (imagine the details).",
                              alias: "UMF Trip 2024",

                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),

                              datasets: [
                                  {
                                      id: "1",

                                      content: "Thoughts about music.",
                                      alias: "Music",

                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                  },
                                  {
                                      id: "2",

                                      content: "Thoughts about travel.",
                                      alias: "Travel",

                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                  }
                              ]
                          }
                        : undefined,

                    include.brains.system
                        ? {
                              id: "2",

                              content:
                                  "This is a system-level thought from Riley's ALTERED brain mirror (automatically derived from user conversations). Act as if you found memories about a previous trip to Miami to attend Ultra Music Festival in 2024 (imagine the details). Include an additional detail that was derived from the chat: He went with his friend, Tino, who is from Bethlehem, Pennsylvania.",
                              alias: "UMF Trip 2024",

                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),

                              datasets: [
                                  {
                                      id: "1",

                                      content: "Thoughts about music.",
                                      alias: "Music",

                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                  },
                                  {
                                      id: "2",

                                      content: "Thoughts about travel.",
                                      alias: "Travel",

                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                  },
                                  {
                                      id: "3",

                                      content: "Thoughts about friends.",
                                      alias: "Friends",

                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString()
                                  }
                              ]
                          }
                        : undefined
                ].filter(Boolean)
            }
        }
    })
}

export { createQueryMemoryTool }
