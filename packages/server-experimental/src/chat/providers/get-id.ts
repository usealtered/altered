import { PROVIDERS, type ProviderID, type ProviderKey } from "./definitions"

function getProviderId(providerKey: ProviderKey): ProviderID {
    const providerDef = PROVIDERS.find(provider => provider.key === providerKey)

    if (!providerDef) throw new Error(`Unknown provider key: "${providerKey}".`)
    const { id: providerId } = providerDef

    return providerId
}

export { getProviderId }
