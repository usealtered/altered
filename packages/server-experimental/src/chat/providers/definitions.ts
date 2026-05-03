type Provider = {
    key: string
    id: string
    name: string
}

// spell-checker: disable
const PROVIDERS = [
    {
        key: "sendblue",
        id: "NtDeTkEriIJwLpP2ARrVf",
        name: "Sendblue"
    },
    {
        key: "chat-sdk",
        id: "1SrT3G4msKC1YXBDck4sF",
        name: "Chat SDK"
    }
] as const satisfies Provider[]

const PROVIDER_KEYS = PROVIDERS.map(provider => provider.key)
type ProviderKey = (typeof PROVIDER_KEYS)[number]

const PROVIDER_IDS = PROVIDERS.map(provider => provider.id)
type ProviderID = (typeof PROVIDER_IDS)[number]

export {
    PROVIDER_IDS,
    PROVIDER_KEYS,
    PROVIDERS,
    type Provider,
    type ProviderID,
    type ProviderKey
}
