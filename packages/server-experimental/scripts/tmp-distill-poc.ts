/**
 * Scratchpad for the distillation POC. Loads one chat message, chunks it, and
 * runs the distillation subagent sequentially per chunk. Thoughts are logged
 * only — persistence lands in a later chunk.
 */

import "dotenv/config"

import { parseArgs } from "node:util"
import { desc, eq } from "drizzle-orm"
import { distillationAgent } from "../src/ai/agents/chat/subagents/distillation/definition"
import { splitSourceIntoChunks } from "../src/ai/agents/chat/subagents/distillation/split-source"
import { chatMessages } from "../src/chat/messages/schema"
import { getDatabase } from "../src/storage/database/connection"

const { values } = parseArgs({
    options: {
        "message-id": { type: "string" },
        "max-chunks": { type: "string" }
    }
})

const toPlainText = (content: unknown): string => {
    if (typeof content === "string") return content

    if (!Array.isArray(content)) return JSON.stringify(content)

    return content
        .map(part =>
            part &&
            typeof part === "object" &&
            "text" in part &&
            typeof part.text === "string"
                ? part.text
                : ""
        )
        .filter(Boolean)
        .join("\n")
}

const main = async () => {
    const database = getDatabase()

    const [message] = values["message-id"]
        ? await database
              .select()
              .from(chatMessages)
              .where(eq(chatMessages.id, values["message-id"]))
              .limit(1)
        : await database
              .select()
              .from(chatMessages)
              .orderBy(desc(chatMessages.createdAt))
              .limit(1)

    if (!message) throw new Error("No chat message found to distill.")

    const source = toPlainText(message.content)
    const chunks = splitSourceIntoChunks(source)
    const maxChunks = values["max-chunks"]
        ? Number(values["max-chunks"])
        : chunks.length

    console.log(
        JSON.stringify(
            {
                messageId: message.id,
                role: message.role,
                sourceLength: source.length,
                chunkCount: chunks.length,
                processingChunks: Math.min(maxChunks, chunks.length)
            },
            null,
            2
        )
    )

    const allThoughts: unknown[] = []

    for (const chunk of chunks.slice(0, maxChunks)) {
        const context = {
            source,
            chunks,
            chunkIndex: chunk.index,
            collectedThoughts: [] as {
                content: string
                start: number
                end: number
                alreadyCovered: boolean
                note?: string
            }[]
        }

        console.log(
            `\n--- chunk ${chunk.index} (${chunk.kind}) [${chunk.start}:${chunk.end}] ---`
        )
        console.log(chunk.text)

        const result = await distillationAgent.generate({
            options: { context },
            messages: [
                {
                    role: "user",
                    content: [
                        `Distill chunk ${chunk.index + 1} of ${chunks.length}.`,
                        `Chunk kind: ${chunk.kind}.`,
                        `Offsets: ${chunk.start}-${chunk.end}.`,
                        "",
                        chunk.text
                    ].join("\n")
                }
            ]
        })

        console.log("agent text:", result.text)
        console.log(
            "thoughts:",
            JSON.stringify(context.collectedThoughts, null, 2)
        )

        allThoughts.push(
            ...context.collectedThoughts.map(thought => ({
                chunkIndex: chunk.index,
                ...thought
            }))
        )
    }

    console.log("\n=== summary ===")
    console.log(
        JSON.stringify(
            { thoughtCount: allThoughts.length, allThoughts },
            null,
            2
        )
    )
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
