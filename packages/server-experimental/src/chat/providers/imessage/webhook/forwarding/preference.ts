import { deleteKv, getKv, setKv } from "../../../../../storage/kv/basic"

const WEBHOOK_FORWARDING_PREFERENCE_KEY =
    "chat:imessage:admin:webhook-forwarding-target"

const WEBHOOK_FORWARDING_TARGETS = ["preview-development"] as const

type WebhookForwardingTarget = (typeof WEBHOOK_FORWARDING_TARGETS)[number]
type WebhookForwardingResolvedTarget = WebhookForwardingTarget | "none"

const getWebhookForwardingPreferenceKey = ({
    phoneNumber
}: {
    phoneNumber: string
}): string => `${WEBHOOK_FORWARDING_PREFERENCE_KEY}:${phoneNumber}`

function resolveWebhookForwardingTarget(
    value: unknown
): WebhookForwardingResolvedTarget | null {
    if (value === null || value === undefined) return "none"

    if (typeof value !== "string") return null

    const normalizedValue = value.trim().toLowerCase()

    return WEBHOOK_FORWARDING_TARGETS.includes(
        normalizedValue as WebhookForwardingTarget
    )
        ? (normalizedValue as WebhookForwardingTarget)
        : null
}

async function getWebhookForwardingTargetPreference({
    phoneNumber
}: {
    phoneNumber: string
}): Promise<
    | { success: true; value: WebhookForwardingResolvedTarget }
    | { success: false; value: "none" }
> {
    const key = getWebhookForwardingPreferenceKey({ phoneNumber })

    const { success, value } = await getKv({ key })
    if (!success) return { success: false, value: "none" }

    const resolvedValue = resolveWebhookForwardingTarget(value)
    if (!resolvedValue) {
        console.error(
            `Failed to parse forwarding target for key "${key}". Expected one of: ${WEBHOOK_FORWARDING_TARGETS.join(", ")}.`
        )

        return { success: false, value: "none" }
    }

    return { success: true, value: resolvedValue }
}

function setWebhookForwardingTargetPreference({
    phoneNumber,
    target
}: {
    phoneNumber: string
    target: WebhookForwardingResolvedTarget
}): Promise<{ success: boolean }> {
    const key = getWebhookForwardingPreferenceKey({ phoneNumber })

    if (target === "none") return deleteKv({ key })

    return setKv({ key, value: target })
}

export {
    getWebhookForwardingPreferenceKey,
    getWebhookForwardingTargetPreference,
    setWebhookForwardingTargetPreference,
    type WebhookForwardingResolvedTarget,
    type WebhookForwardingTarget
}
