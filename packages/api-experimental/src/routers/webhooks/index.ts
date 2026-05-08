import { Hono } from "hono"
import { sendblueWebhookRouter } from "./sendblue"

const app = new Hono()

app.route("/sendblue", sendblueWebhookRouter)

export { app as webhooksRouter }
