/**
 * @remarks This file contains a lot of temporary-use, ugly code that may be converted to be agent-managed or deprecated in favour of a simpler observability solution. Consider other options.
 */

import "dotenv/config"

import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { parseArgs } from "node:util"
import { ArkErrors, type } from "arktype"
import { chatAgent } from "../src/ai/agents/chat/definition"
import { createChatAgentInstructions } from "../src/ai/agents/chat/instructions/composition"
import { prepareMessagesForGeneration } from "../src/ai/generate/prepare-messages"
import {
    formatOpenRouterCost,
    parseOpenrouterProviderMetadata
} from "../src/ai/provider/metadata"
import type { ChatMessage } from "../src/chat/messages/schema"

const STARTED_AT = new Date()

const OMITTED_MESSAGES_NOTE_MESSAGE = {
    role: "system",
    content:
        "NOTE: Prior message(s) omitted from this log entry. See `instructions`, `messages`, and earlier step `requestDelta` entries for full context."
} as const

function createMessageHashInput(message: unknown): string {
    if (!message || typeof message !== "object") return JSON.stringify(message)

    const { role, content, tool_call_id, name, tool_calls } = message as {
        role?: string
        content?: unknown
        tool_call_id?: string
        name?: string
        tool_calls?: unknown
    }

    let text = ""

    if (typeof content === "string") text = content
    else if (Array.isArray(content))
        text = content
            .map(part =>
                part &&
                typeof part === "object" &&
                "text" in part &&
                typeof part.text === "string"
                    ? part.text
                    : JSON.stringify(part)
            )
            .join("\n")

    return JSON.stringify({ role, text, tool_call_id, name, tool_calls })
}

function createMockDatabaseMessage({
    role,
    content,

    date
}: {
    role: ChatMessage["role"]
    content: string

    date: Date | { offsetInMinutes: number }
}): ChatMessage {
    const createdAt =
        "offsetInMinutes" in date
            ? new Date(STARTED_AT.getTime() + date.offsetInMinutes * 60_000)
            : date

    return {
        id: `mock-message-${role}-${createdAt.toISOString()}`,

        conversationId: "mock-conversation",
        userId: null,
        brainId: null,

        role,
        content,

        createdAt,
        updatedAt: createdAt
    }
}

const mockDatabaseMessages: ChatMessage[] = [
    createMockDatabaseMessage({
        role: "user",
        content:
            "Hey Koa, I am trying to decide whether to return to Miami for Ultra next year.",

        date: { offsetInMinutes: 0 }
    }),

    createMockDatabaseMessage({
        role: "assistant",
        content:
            "I can help you compare the trip against what you enjoyed last time.",

        date: { offsetInMinutes: 2 }
    }),

    createMockDatabaseMessage({
        role: "user",
        content:
            "Please check memory, distill this message, set my app target to the local development preview, and switch the conversation to the cheap OpenAI nano model after this.",

        date: { offsetInMinutes: 5 }
    })
]

const modelMessages = prepareMessagesForGeneration(mockDatabaseMessages, {
    modelId: "anthropic/claude-sonnet-4.6",
    enableExplicitCacheControl: { anthropic: true }
})

const { values } = parseArgs({
    options: {
        agentId: {
            type: "string",
            default: "chat",
            short: "a"
        }
    }
})

const agentIdSchema = type("'chat'")

const agentId = agentIdSchema(values.agentId ? values.agentId : "chat")
if (agentId instanceof ArkErrors)
    throw new Error(`Invalid agent ID: ${agentId.summary}`)

if (agentId !== "chat") throw new Error(`Agent ID not implemented: ${agentId}`)

const result = await chatAgent.generate({
    options: {
        config: {
            channel: {
                provider: "imessage",
                type: "direct"
            },

            enableAdminTools: true
        },

        context: {
            user: {
                phoneNumber: "+15555550123",
                planId: "paid"
            }
        }
    },

    messages: modelMessages
})

const instructions = createChatAgentInstructions({
    channel: { provider: "imessage", type: "direct" },
    includeAdminTools: true
})

const seenMessageHashInputs = new Set([
    createMessageHashInput({ role: "system", content: instructions }),
    ...modelMessages.map(createMessageHashInput)
])

const stepResults = result.steps.map(step => {
    const openrouterProviderMetadata =
        parseOpenrouterProviderMetadata(step.providerMetadata)?.openrouter ??
        null

    const requestBody = step.request.body as Record<string, unknown> | undefined
    const requestMessages = Array.isArray(requestBody?.messages)
        ? requestBody.messages
        : []

    const deltaMessages: unknown[] = []
    let omittedMessageCount = 0

    for (const message of requestMessages) {
        const hashInput = createMessageHashInput(message)

        if (seenMessageHashInputs.has(hashInput)) {
            omittedMessageCount++
            continue
        }

        seenMessageHashInputs.add(hashInput)
        deltaMessages.push(message)
    }

    const { messages: _messages, ...requestBodyWithoutMessages } =
        requestBody ?? {}

    const { raw: _raw, ...usage } = step.usage

    return {
        stepNumber: step.stepNumber,
        finishReason: step.finishReason,
        modelId: step.response.modelId,
        inferenceProvider: openrouterProviderMetadata?.provider ?? null,

        request: {
            body: requestBodyWithoutMessages
        },

        requestDelta: {
            omittedMessageCount,

            messages:
                omittedMessageCount > 0
                    ? [OMITTED_MESSAGES_NOTE_MESSAGE, ...deltaMessages]
                    : deltaMessages
        },

        toolCalls: step.toolCalls.map(toolCall => ({
            toolName: toolCall.toolName,
            input: toolCall.input
        })),

        toolResults: step.toolResults.map(toolResult => ({
            toolName: toolResult.toolName,
            output: toolResult.output
        })),

        text: step.text,

        usage,
        cost: openrouterProviderMetadata?.usage?.cost ?? null
    }
})

const { raw: _totalRaw, ...totalUsage } = result.totalUsage

const logData = {
    agentId: chatAgent.id,
    createdAt: STARTED_AT.toISOString(),

    instructions,

    messages: modelMessages,
    messagesIncludeMetadataHeaders: true,
    messagesIncludeEphemeral: true,

    steps: stepResults,

    summary: {
        stepCount: result.steps.length,
        finishReason: result.finishReason,

        modelId: result.response.modelId,
        inferenceProviders: [
            ...new Set(
                stepResults.map(step => step.inferenceProvider).filter(Boolean)
            )
        ],

        cost: formatOpenRouterCost(
            stepResults.reduce((acc, step) => acc + (step.cost ?? 0), 0)
        ),
        usage: totalUsage
    }
}

const logDirectory = join(
    process.cwd(),
    ".logs",
    "agents",
    chatAgent.id ?? "unknown",
    "runs"
)

const logFileName = `${STARTED_AT.toISOString().replace(/[:.]/g, "-")}.json`
const logFilePath = join(logDirectory, logFileName)

await mkdir(logDirectory, { recursive: true })
await writeFile(logFilePath, `${JSON.stringify(logData, null, 4)}\n`)

console.log("[scripts:run-agent] Agent run completed.")
console.log(`[scripts:run-agent] Log file: file://${logFilePath}`)
console.log(
    "[scripts:run-agent] Summary:",
    JSON.stringify(
        {
            finishReason: logData.summary.finishReason,
            stepCount: logData.summary.stepCount,
            cost: logData.summary.cost,
            preview: logData.steps.at(-1)?.text.slice(0, 512) ?? null
        },
        null,
        2
    )
)
