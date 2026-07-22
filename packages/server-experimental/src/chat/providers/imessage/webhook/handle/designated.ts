import { getAlteredChat } from "../../../../instance"
import type { SendblueWebhookContext } from "../process"
import { handleOrderCoffeeDemoMessageIngestStep } from "./order-coffee"

async function handleDesignatedWebhook({
    request,
    waitUntil
}: SendblueWebhookContext): Promise<Response> {
    const { shouldContinue: shouldContinueAfterOrderingCoffee } =
        // we should potentially move our coffee agent into the main webhook handler and add it as a tool that the main agent can call with all the previous chat details and delegate to the coffee subagent, then the coffee subagent can relay a request for more information to the main agent, who has all conversation context and can respond intricately.

        //  However, once that is all done (we could potentially stash all of the system-admin-forwarding-related changes, and then re-apply once coffee experiments are committed, then strip out any irrelevant coffee changes from the stash and merge improvements intelligently from the last commit) - we could revisit the admin/command agents, and decide where to put them, and how.

        //  From a natural, proper-conversation perspective - these admin tools should be tools/subagents of the main chat agent, rather than message-less interrupts outside of the main Chat SDK routing. That way, every message/interaction is natural, informed, and intelligible.

        // HOWEVER - caveats. a) requiring ALL message history with the default chat model is expensive, slower, and probably over-intelligent. Short-cutting to a mini routing/task model would be better in all ways. b) Letting it route to the Chat SDK means that for admin changes like routing, models, etc - we have to complete 1 full, previous cycle before our settings are updated. Which it kind of has to do anyways... with the EXCEPTION of strippable slash commands (possible, but messy, not savable ideally, and easy to mess up) which are fast and can make changes same-message. UNLESS (weigh pros/cons) we re-run the main agent inside the Chat SDK webhook handler with updated settings via a tool call, that could even trigger a forward/model change, etc from there and then exit using a no-op/done tool call (AND not save messages). This could implicitly be designed as a "agent restart". I have a feeling (God gave me a sign) that this may be the way to go, which would really allow us to consolidate all agents to one top-level orchestrator agent that could be re-ran by itself. So practically: it could forward responses to the dev server (etc) and then "exit" based on instructions to do so (which would end the agent turn, hopefully exit, and then we detect that tool call and do nothing) - then when we forward the request and wire to the agent, somehow (either wired into payload, maybe on separate composite endpoint for deployment forwarding of multiple types of data - pros/cons? or stored in redis/db as a quick-access value) we need to read/receive a "restart" or "continue/resume" preference/value that details what was run/changed, as well as any other details or state needed. For forwarding, this might include JSON details in the ephemeral system prompt, another system message, MAYBE a previous assistant message with a content part / tool call that details this, that we actually pull from message history, OR it's wired through call options --- however it's done, we need to get this value into context e.g., for forwarding `[{wasForwarded: true, from: { applicationTarget:"api", environment: "production" }, to:  { applicationTarget:"api-experimental", environment: "preview" }}] or the equivalent in whatever format we choose. For restarting with a different model ID, we should instead trigger a "restart" tool (instructed in system prompt) that basically updates the preferences in the "update-model" prompt, then calls restart. If the tool calls are saved in messages, maybe message history will be enough (although by default I don't think it saves tool calls without an execute function). And I'm also not sure if we can continue directly from the latest assistant message, we may need to add another user message OR depending on what messages are stored (and other details), we may omit the previous assistant message entirely, and re-run on the latest user message. Although even in this case with a "model id restart" we need to pass context somehow to make the model aware, so it doesn't call the changes and the restart again. Something like [{didRestart: true, configChanges: { modelId: { from: "ABC", to: "XYZ"}}}]. Or instead of JSON, this context could even be summarized into a tool, system, or assistant message to be added to the messages (or if not history, something like Redis and then loaded into the ephemeral prompt). Although JSON is probably the most concise, alternatively we could consider our variable format: DID_RESTART: true; FROM_MODEL_ID: "ABC"; ... as it is the most token efficient and probably most clear. For the restart itself - we could just read tool calls for that tool trigger, and then wrap the entire agent generation in a `while` loop that re-loads core configuration details like the model ID (if we see a future where we might restart multiple times for the same message - unlikely) OR just wrap that in a function and call an if (restart) loadAndGenerateWithMainAgent() (pseudocode).

        // other note - when we add agent skills, we should obviously load some from fs for core altered utils that should be baked, but also in the future, we should be able to modify some of them from the Raycast admin extension

        // >>>>>>>>>> so next steps when we come back: SAVE stash with all current state, continue to develop coffee demo for agent infra + strip out other conflicting feature sets (forwarding, admin toggles), refine that as planned, commit, then re-apply stash, filter out old coffee changes, then continue with adapting the forwarding/admin changes --- we could even do this multiple times if we see a need to split into steps

        await handleOrderCoffeeDemoMessageIngestStep({
            request,
            waitUntil
        })

    if (!shouldContinueAfterOrderingCoffee)
        return new Response("OK", { status: 200 })

    const chat = getAlteredChat()
    const handleWithChatSdk = chat.webhooks.sendblue

    return await handleWithChatSdk(
        new Request(request.raw.url, {
            body: request.text,
            headers: request.raw.headers,
            method: request.raw.method
        }),

        { waitUntil }
    )
}

export { handleDesignatedWebhook }
