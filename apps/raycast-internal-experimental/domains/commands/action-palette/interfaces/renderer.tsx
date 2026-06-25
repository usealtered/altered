import { Detail } from "@raycast/api"
import { CollectionInterface } from "./collections/implementation"
import type { ALTEREDInterface } from "./definitions"

function InterfaceRenderer({ interfaces }: { interfaces: ALTEREDInterface[] }) {
    /**
     * @remarks Interfaces will be traversable, but for this demo, we'll simply render the first one.
     */
    const rootInterface = interfaces[0]
    if (!rootInterface) return null

    const { type, content } = rootInterface

    switch (type) {
        case "collection":
            return <CollectionInterface content={content} />

        case "markdown":
            return <Detail markdown={content} />

        default:
            return null
    }
}

export { InterfaceRenderer }
