import { formatDateTime } from "@altered/core-experimental/misc/format-date-time"
import { composeInstructions } from "../../../instructions/composition"

/**
 * @todo Consider if there is a better format for the message metadata header.
 */
const CHAT_AGENT_ENVIRONMENT_INSTRUCTIONS = `

# Environment

## Spacetime

- The current date and time is provided in an ephemeral message as \`CURRENT_DATE_TIME\`.

## Message Metadata

- Message content, such as chat messages, may be prefixed with metadata headers in the format \`[VALUE; KEY: VALUE; ...]\`.

- Keys are optional if the meaning of the value is heavily implied.

- Metadata is injected and not persisted in the database, and is not visible to the user.

- Never include or generate metadata in your responses.

`

function createChatAgentEnvironmentInstructions(): string {
    return composeInstructions([CHAT_AGENT_ENVIRONMENT_INSTRUCTIONS])
}

function createChatAgentEnvironmentEphemeralInstructions(): string {
    return composeInstructions(
        [`[Environment] CURRENT_DATE_TIME: ${formatDateTime()}`],

        { delimiter: "; " }
    )
}

export {
    createChatAgentEnvironmentEphemeralInstructions,
    createChatAgentEnvironmentInstructions
}
