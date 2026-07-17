import { conversations } from "../../chat/conversations/schema"
import { chatMessages } from "../../chat/messages/schema"
import { agentRuns } from "../../models/agent-runs/storage/schema"
import { attributes } from "../../models/attributes/storage/schema"
import { datasets } from "../../models/datasets/storage/schema"
import { tags } from "../../models/tags/storage/schema"
import { thoughts } from "../../models/thoughts/storage/schema"
import { thoughtsToDatasets } from "../../models/thoughts-to-datasets/storage/schema"
import { externalResources } from "./external-resources/schema"

const schema = {
    conversations,
    chatMessages,
    datasets,
    thoughts,
    thoughtsToDatasets,
    attributes,
    tags,
    agentRuns,
    externalResources
}

export { schema }
