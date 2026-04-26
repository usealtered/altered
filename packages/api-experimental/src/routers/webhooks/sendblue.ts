import { processSendblueWebhook } from "@altered/server-experimental/chat/imessage/handler"
import { waitUntil } from "@vercel/functions"
import { Hono } from "hono"

const app = new Hono()

app.post("/", context => processSendblueWebhook(context.req.raw, { waitUntil }))

export { app as sendblueWebhookRouter }
