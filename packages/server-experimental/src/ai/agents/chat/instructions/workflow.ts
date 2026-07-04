import { composeInstructions } from "../../../instructions/composition"

/**
 * @todo P3: If we're forcing tool calls in the agent props, we can probably limit the instructions down to just information about the process.
 */
const CHAT_AGENT_WORKFLOW_INSTRUCTIONS = `

# Workflow

1. Query memory: always call the \`query-memory\` tool **at least once**. If the query reveals areas to expand on, call the tool again. Repeat until satisfied.

2. Handle actionable intent: if the user's message implies actionable intent, call the appropriate tool for each intent. Repeat until all intents are handled.

3. Distill message: distill the user's latest message.

4. Respond: generate a final response to the user's message.

`

const CHAT_AGENT_PSEUDOCODE_WORKFLOW_INSTRUCTIONS = `

# Workflow

\`\`\`pseudocode
{
    queryMemory()
} while (not satisfied)

if (actionableIntents) {
    for (intent of actionableIntents) {
        callTool()
    }
}

distillMessage(latestUserMessage)

generateResponse()
\`\`\`

`

function createChatAgentWorkflowInstructions(options?: {
    experimental_usePseudocode?: boolean
}): string {
    return composeInstructions([
        options?.experimental_usePseudocode
            ? CHAT_AGENT_PSEUDOCODE_WORKFLOW_INSTRUCTIONS
            : CHAT_AGENT_WORKFLOW_INSTRUCTIONS
    ])
}

export { createChatAgentWorkflowInstructions }
