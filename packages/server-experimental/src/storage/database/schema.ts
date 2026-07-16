import { conversations } from "../../chat/conversations/schema"
import { chatMessages } from "../../chat/messages/schema"
import { datasets } from "../../models/datasets/storage/schema"
import { thoughts } from "../../models/thoughts/storage/schema"
import { thoughtsToDatasets } from "../../models/thoughts-to-datasets/storage/schema"
import { externalResources } from "./external-resources/schema"

const schema = {
    conversations,
    chatMessages,
    datasets,
    thoughts,
    thoughtsToDatasets,
    externalResources
}

export { schema }
