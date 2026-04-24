import { handleSendblueWebhook } from "@altered/server-experimental/sendblue/handler"
import { Hono } from "hono"

const app = new Hono()

app.post("/", handleSendblueWebhook)

export { app as sendblueWebhookRouter }
