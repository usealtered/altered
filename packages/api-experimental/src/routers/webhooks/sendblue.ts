import { processSendblueWebhook } from "@altered/server-experimental/chat/providers/imessage/webhook/process"
import { waitUntil } from "@vercel/functions"
import { Hono } from "hono"

const app = new Hono()

app.post("/", context =>
    processSendblueWebhook({ request: context.req.raw, options: { waitUntil } })
)

export { app as sendblueWebhookRouter }
