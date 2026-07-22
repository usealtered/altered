import { generateText } from "ai"
import { createOpenRouterChatModel } from "../../../../ai/provider/create-chat-model"
import type { WebhookForwardingResolvedTarget } from "./forwarding/preference"

type AdminWebhookForwardingDecision = {
    action: "set-webhook-forwarding-target" | "none"
    target: "preview-development" | "none" | null
    confidence: number
}

const HIGH_CONFIDENCE_THRESHOLD = 0.9

function parseJsonObject(text: string): Record<string, unknown> | null {
    const normalizedText = text.trim().replace(/^```(?:json)?\s*|\s*```$/g, "")

    try {
        const parsed = JSON.parse(normalizedText)
        return parsed && typeof parsed === "object" ? parsed : null
    } catch {
        return null
    }
}

async function resolveAdminWebhookForwardingDecision({
    message
}: {
    message: string
}): Promise<{ target: WebhookForwardingResolvedTarget } | null> {
    const { text } = await generateText({
        model: createOpenRouterChatModel({
            modelId: "openai/gpt-5.4-nano"
        }),
        system: [
            "You classify one user message for an internal dev-control command.",
            "Return JSON only with keys: action, target, confidence.",
            "action is 'set-webhook-forwarding-target' when the user explicitly asks to set webhook forwarding mode. Otherwise 'none'.",
            "target is 'preview-development' or 'none'. Map preview/development requests to 'preview-development'. Map production/disable/off/stop requests to 'none'.",
            "confidence is a number between 0 and 1. Use high confidence only for explicit imperative requests."
        ].join("\n"),
        prompt: `Message: ${JSON.stringify(message)}`
    })

    const parsed = parseJsonObject(text)
    if (!parsed) return null

    const { action, target, confidence } =
        parsed as unknown as AdminWebhookForwardingDecision

    if (action !== "set-webhook-forwarding-target") return null
    if (target !== "preview-development" && target !== "none") return null
    if (
        typeof confidence !== "number" ||
        confidence < HIGH_CONFIDENCE_THRESHOLD
    )
        return null

    return { target }
}

async function createWebhookForwardingConfirmationMessage({
    target
}: {
    target: WebhookForwardingResolvedTarget
}): Promise<string> {
    const fallbackMessage =
        target === "preview-development"
            ? "Webhook forwarding mode is now set to preview development."
            : "Webhook forwarding mode is now set to none."

    try {
        const { text } = await generateText({
            model: createOpenRouterChatModel({
                modelId: "anthropic/claude-sonnet-4.6"
            }),
            system: "Reply with exactly one concise sentence confirming this internal setting change. No emojis, no extra offers, no markdown.",
            prompt: `Change: webhook forwarding mode -> ${target}.`
        })

        return text.trim() || fallbackMessage
    } catch {
        return fallbackMessage
    }
}

// come back to https://ai-sdk.dev/providers/community-providers/supermemory when ready

export {
    createWebhookForwardingConfirmationMessage,
    resolveAdminWebhookForwardingDecision
}
