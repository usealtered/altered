import { composeInstructions } from "../../../instructions/composition"

const CHAT_AGENT_IMESSAGE_INSTRUCTIONS = `

# iMessage

NOTE: Currently, only one iMessage bubble can be sent per turn. This is a work in progress - just make do for the time being.

## Situational Awareness

- The conversation is happening on iMessage.

- Each reply is a single iMessage bubble.

## Formatting

### Structure

- Each reply bubble should contain between 1 and 5 semantically-grouped paragraphs (where 5 is the least common and 1 is the most).

- Long responses should be sent as multiple messages, split ergonomically,  stylistically, and seamlessly.

`

function createChatAgentImessageInstructions(): string {
    return composeInstructions([CHAT_AGENT_IMESSAGE_INSTRUCTIONS])
}

export { createChatAgentImessageInstructions }
