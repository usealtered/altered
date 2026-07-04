import { ToolLoopAgent } from "ai"
import { createOpenrouterChatModel } from "../../../../provider/create-chat-model"

const distillationAgent = new ToolLoopAgent({
    model: createOpenrouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),

    instructions: undefined,

    tools: {}
})

export { distillationAgent }
