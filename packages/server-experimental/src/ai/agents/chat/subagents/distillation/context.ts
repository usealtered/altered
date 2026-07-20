import { type } from "arktype"

const distillationAgentContextSchema = type({
    source: "string",

    chunks: type({
        index: "number.integer >= 0",
        start: "number.integer >= 0",
        end: "number.integer >= 0",
        text: "string",
        kind: "'sentence' | 'length-fallback'"
    }).array(),

    chunkIndex: "number.integer >= 0",

    collectedThoughts: type({
        content: "string",
        start: "number.integer >= 0",
        end: "number.integer >= 0",
        alreadyCovered: "boolean",
        "note?": "string"
    }).array()
})

type DistillationAgentContext = typeof distillationAgentContextSchema.infer

export { type DistillationAgentContext, distillationAgentContextSchema }
