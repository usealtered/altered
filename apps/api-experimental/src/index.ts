import ALTEREDAPI from "@altered/api-experimental"

const app = new ALTEREDAPI()

//  TODO P0: Implement with Effect.

const isVercel = process.env.VERCEL === "1"
if (!isVercel) void app.serve()

export default app
