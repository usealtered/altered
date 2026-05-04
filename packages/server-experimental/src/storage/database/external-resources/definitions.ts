import type { ProviderID } from "../../../chat/providers/definitions"

type ExternalResourceType = {
    key: string
    id: string
    name: string
    providerId: ProviderID
}

// spell-checker: disable
const EXTERNAL_RESOURCE_TYPES = [
    {
        key: "message",
        id: "zpzShHoubbd38iEPM6jMN",
        name: "Message",
        providerId: "NtDeTkEriIJwLpP2ARrVf"
    },

    {
        key: "thread",
        id: "iRtCW3YJHVaQnInB9fJOQ",
        name: "Thread",
        providerId: "1SrT3G4msKC1YXBDck4sF"
    }
] as const satisfies ExternalResourceType[]

const EXTERNAL_RESOURCE_TYPE_KEYS = EXTERNAL_RESOURCE_TYPES.map(
    resource => resource.key
)
type ExternalResourceTypeKey = (typeof EXTERNAL_RESOURCE_TYPE_KEYS)[number]

const EXTERNAL_RESOURCE_TYPE_IDS = EXTERNAL_RESOURCE_TYPES.map(
    resource => resource.id
)
type ExternalResourceTypeID = (typeof EXTERNAL_RESOURCE_TYPE_IDS)[number]

export {
    EXTERNAL_RESOURCE_TYPE_KEYS,
    EXTERNAL_RESOURCE_TYPES,
    type ExternalResourceTypeID,
    type ExternalResourceTypeKey
}
