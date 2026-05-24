import type { ModelMessage } from "ai"

function recordToString(
    record: Record<string, string>,
    options?: { separator?: string }
): string {
    const { separator = "; " } = options ?? {}

    return Object.entries(record)
        .map(([key, value]) => `${key}: ${value}`)
        .join(separator)
}

function formatChatMessageMetadataPrefix(
    values: Record<string, string>
): string {
    return `[${recordToString(values)}] `
}

function modelMessageWithMetadata(
    message: ModelMessage,
    values: Record<string, string>
): ModelMessage {
    const prefix = formatChatMessageMetadataPrefix(values)

    if (typeof message.content === "string")
        return {
            ...message,
            content: `${prefix}${message.content}`
        } as ModelMessage

    if (!Array.isArray(message.content)) return message

    const content = message.content.map((part, index) => {
        if (index > 0 || part.type !== "text") return part

        return { ...part, text: `${prefix}${part.text}` }
    })

    return { ...message, content } as ModelMessage
}

export { modelMessageWithMetadata }
