import { composeInstructions } from "../../../instructions/composition"
import type { ConversationChannel } from "../definition"
import { createChatAgentCapabilitiesInstructions } from "./capabilities"
import {
    createChatAgentEnvironmentEphemeralInstructions,
    createChatAgentEnvironmentInstructions
} from "./environment"
import { createChatAgentIdentityInstructions } from "./identity"
import { createChatAgentImessageInstructions } from "./imessage"
import { createChatAgentPersonaInstructions } from "./persona"
import { createChatAgentWorkflowInstructions } from "./workflow"

/**
 * @todo P2: Consider whether Markdown is the best format. XML-style or an agent skill may be better suited.
 */
function createChatAgentInstructions({
    channel,

    includeAdminTools,

    experimental_usePseudocodeWorkflowInstructions
}: {
    channel: ConversationChannel

    includeAdminTools: boolean

    experimental_usePseudocodeWorkflowInstructions?: boolean
}): string {
    return composeInstructions([
        createChatAgentIdentityInstructions(),
        createChatAgentPersonaInstructions(),
        createChatAgentEnvironmentInstructions(),

        channel.provider === "imessage"
            ? createChatAgentImessageInstructions()
            : null,

        createChatAgentCapabilitiesInstructions({
            includeAdminTools
        }),

        createChatAgentWorkflowInstructions({
            experimental_usePseudocode:
                experimental_usePseudocodeWorkflowInstructions
        })
    ])
}

function createChatAgentEphemeralInstructions(): string {
    return composeInstructions([
        createChatAgentEnvironmentEphemeralInstructions()
    ])
}

export { createChatAgentEphemeralInstructions, createChatAgentInstructions }
