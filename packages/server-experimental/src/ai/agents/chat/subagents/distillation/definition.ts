import { ToolLoopAgent } from "ai"
import { type } from "arktype"
import { createOpenrouterChatModel } from "../../../../provider/create-chat-model"
import { distillationAgentContextSchema } from "./context"
import { distillationAgentInstructions } from "./instructions"
import { distillationToolNames, distillationToolSet } from "./tools"

const distillationAgentId = "distillation" as const

const distillationAgentCallOptionsSchema = type({
    context: distillationAgentContextSchema
})

type DistillationAgentCallOptions =
    typeof distillationAgentCallOptionsSchema.infer

const distillationAgent = new ToolLoopAgent({
    id: distillationAgentId,

    model: createOpenrouterChatModel({
        modelId: "anthropic/claude-sonnet-4.6"
    }),

    tools: distillationToolSet,
    activeTools: [...distillationToolNames],
    toolChoice: "auto",
    experimental_context: null,

    callOptionsSchema: distillationAgentCallOptionsSchema,

    prepareCall: ({ options: { context }, ...params }) => ({
        ...params,

        experimental_context: context,
        instructions: distillationAgentInstructions
    }),

    stopWhen: ({ steps }) => steps.length === 15,

    instructions:
        "These system instructions should be entirely overridden. Please indicate a technical error."
})

export {
    type DistillationAgentCallOptions,
    distillationAgent,
    distillationAgentCallOptionsSchema,
    distillationAgentId
}
