import { getUpstashRedisClient } from "./instance"

async function setKv({
    key,
    value
}: {
    key: string
    value: string
}): Promise<{ success: boolean }> {
    const client = getUpstashRedisClient()
    if (!client) {
        console.error(
            "Failed to set KV: Upstash Redis client not found. This should never happen."
        )

        return { success: false }
    }

    try {
        await client.set(key, value)

        return { success: true }
    } catch {
        console.error(`Failed to set KV: ${key} = ${value}`)

        return { success: false }
    }
}

async function getKv({ key }: { key: string }): Promise<string | null> {
    const client = getUpstashRedisClient()
    if (!client) {
        console.error(
            "Failed to get KV: Upstash Redis client not found. This should never happen."
        )

        return null
    }

    try {
        return await client.get(key)
    } catch {
        console.error(`Failed to get KV: ${key}`)

        return null
    }
}

function setKvBoolean({
    key,
    value
}: {
    key: string
    value: boolean
}): Promise<{ success: boolean }> {
    return setKv({ key, value: value ? "1" : "0" })
}

async function getKvBoolean({ key }: { key: string }): Promise<boolean | null> {
    const value = await getKv({ key })

    if (!value) return null

    if (value !== "1" && value !== "0") {
        console.error(
            `Failed to get KV boolean: Invalid value for key "${key}". Expected "1" or "0".`
        )

        return null
    }

    return value === "1" ? true : false
}

async function toggleKvBoolean({
    previous,

    key
}: {
    previous?: boolean

    key: string
}): Promise<{ success: boolean; value: boolean }> {
    const value = previous ?? (await getKvBoolean({ key }))

    const nextValue = value ? !value : true

    const { success } = await setKvBoolean({ key, value: nextValue })
    if (!success) return { success: false, value: value ?? false }

    return { success: true, value: nextValue }
}

export { getKv, getKvBoolean, setKv, setKvBoolean, toggleKvBoolean }
