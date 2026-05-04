import {
    PROVIDERS,
    type ProviderKey
} from "../../../chat/providers/definitions"
import type {
    ExternalResourceTypeID,
    ExternalResourceTypeKey
} from "./definitions"
import { EXTERNAL_RESOURCE_TYPES } from "./definitions"

function getExternalResourceTypeId({
    provider: providerKey,
    type: resourceTypeKey
}: {
    provider: ProviderKey
    type: ExternalResourceTypeKey
}): ExternalResourceTypeID {
    const providerDef = PROVIDERS.find(provider => provider.key === providerKey)

    if (!providerDef) throw new Error(`Unknown provider key: "${providerKey}".`)
    const { id: providerId } = providerDef

    const resourceTypeDef = EXTERNAL_RESOURCE_TYPES.find(
        resource =>
            resource.providerId === providerId &&
            resource.key === resourceTypeKey
    )

    if (!resourceTypeDef)
        throw new Error(
            `Unknown external resource type key: "${resourceTypeKey}".`
        )
    const { id: resourceTypeId } = resourceTypeDef

    return resourceTypeId
}

export { getExternalResourceTypeId }
