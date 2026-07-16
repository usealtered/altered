import { conversations } from "../../chat/conversations/schema"
import { chatMessages } from "../../chat/messages/schema"
import { thoughts } from "../../models/thoughts/storage/schema"
import { externalResources } from "./external-resources/schema"

const schema = {
    conversations,
    chatMessages,
    thoughts,
    externalResources
}

export { schema }
