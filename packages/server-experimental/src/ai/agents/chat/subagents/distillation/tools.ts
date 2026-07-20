import { tool } from "ai"
import { type } from "arktype"
import { distillationAgentContextSchema } from "./context"
import { expandSourceContext } from "./expand-source-context"
import { searchSourceText } from "./search-source-text"

const createExpandContextTool = () =>
    tool({
        title: "Expand Context",
        description:
            "Expand before/after the current chunk by characters, words, or chunks.",

        type: "function",
        strict: true,

        inputSchema: type({
            direction: type("'before' | 'after' | 'both'").describe(
                "Which side of the chunk to expand."
            ),
            amount: type("number.integer > 0").describe(
                "How far to expand in the chosen unit."
            ),
            unit: type("'characters' | 'words' | 'chunks'").describe(
                "Expansion unit."
            )
        }),

        execute: (input, { experimental_context }) => {
            const context =
                distillationAgentContextSchema.assert(experimental_context)
            const chunk = context.chunks[context.chunkIndex]

            if (!chunk)
                throw new Error("Current distillation chunk is missing.")

            return expandSourceContext({
                source: context.source,
                start: chunk.start,
                end: chunk.end,
                direction: input.direction,
                amount: input.amount,
                unit: input.unit,
                chunks: context.chunks
            })
        }
    })

const createSearchSourceTool = () =>
    tool({
        title: "Search Source",
        description:
            "Search the full source for terms that may sit far from the current chunk.",

        type: "function",
        strict: true,

        inputSchema: type({
            terms: type("string[]").describe(
                "Words or phrases to find in the source text."
            )
        }),

        execute: ({ terms }, { experimental_context }) => {
            const context =
                distillationAgentContextSchema.assert(experimental_context)
            const chunk = context.chunks[context.chunkIndex]

            if (!chunk)
                throw new Error("Current distillation chunk is missing.")

            return {
                matches: searchSourceText(context.source, terms, {
                    excludeRange: { start: chunk.start, end: chunk.end }
                })
            }
        }
    })

const createRecordThoughtTool = () =>
    tool({
        title: "Record Thought",
        description:
            "Record one distilled thought with its source positional span.",

        type: "function",
        strict: true,

        inputSchema: type({
            content: type("string").describe(
                "One precise natural-language sentence for the thought."
            ),
            start: type("number.integer >= 0").describe(
                "Inclusive start offset in the full source."
            ),
            end: type("number.integer >= 0").describe(
                "Exclusive end offset in the full source."
            ),
            "alreadyCovered?": type("boolean").describe(
                "True when this point was already distilled from prior chunk context."
            ),
            "note?": type("string").describe(
                "Optional short note, especially for alreadyCovered cases."
            )
        }),

        execute: (input, { experimental_context }) => {
            const context =
                distillationAgentContextSchema.assert(experimental_context)

            if (input.end < input.start)
                throw new Error("Thought end must be >= start.")

            context.collectedThoughts.push({
                content: input.content,
                start: input.start,
                end: input.end,
                alreadyCovered: input.alreadyCovered ?? false,
                note: input.note
            })

            return {
                success: true as const,
                thoughtCount: context.collectedThoughts.length
            }
        }
    })

const distillationToolSet = {
    "expand-context": createExpandContextTool(),
    "search-source": createSearchSourceTool(),
    "record-thought": createRecordThoughtTool()
}

const distillationToolNames = Object.keys(
    distillationToolSet
) as (keyof typeof distillationToolSet)[]

export { distillationToolNames, distillationToolSet }
