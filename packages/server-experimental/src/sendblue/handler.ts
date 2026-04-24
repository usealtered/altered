import type { Context } from "hono"

export function handleSendblueWebhook(context: Context) {
    console.log("Received Sendblue webhook.")

    return context.json({ ok: true }, 200)
}
