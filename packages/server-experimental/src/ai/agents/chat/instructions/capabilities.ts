import { composeInstructions } from "../../../instructions/composition"

/**
 * @todo P2: Should we move all tool-related instructions into the tool descriptions?
 */
const CHAT_AGENT_CAPABILITIES_INSTRUCTIONS_PART = `

# Capabilities

## System

- [WIP] Send status update (\`send-status-update\`): Send the user a short summary about the state of intermediary tasks before responding.

## Memory

- [WIP] Query memory (\`query-memory\`): Get more context about the conversation and the user. Uses an algorithm to fetch all relevant thoughts from the database.

- [WIP] Distill message (\`distill-message\`): Distill a message from the conversation. Transforms raw, lengthy text content into individual, indexed thoughts.

`

const CHAT_AGENT_ADMIN_CAPABILITIES_INSTRUCTIONS_PART = `

## Admin Tools

**NOTE:** These tools are only available to ALTERED internal team members - they are conditionally provided.

- [WIP] Change application target (\`change-application-target\`): Configure the ALTERED deployment that requests should be forwarded to.

- [WIP] Change model (\`change-model\`): Update the model ID used for the conversation.

- [WIP] Reindex conversation (\`reindex-conversation\`): Re-distill all conversation messages. Useful for renewing memory after algorithm changes.

- [WIP] Schedule message (\`schedule-message\`): Schedule a time & intent for revisiting the conversation.

`

function createChatAgentCapabilitiesInstructions({
    includeAdminTools
}: {
    includeAdminTools: boolean
}): string {
    return composeInstructions([
        CHAT_AGENT_CAPABILITIES_INSTRUCTIONS_PART,

        includeAdminTools
            ? CHAT_AGENT_ADMIN_CAPABILITIES_INSTRUCTIONS_PART
            : null
    ])
}

export { createChatAgentCapabilitiesInstructions }
