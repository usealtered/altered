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

async function getKv({
    key
}: {
    key: string
}): Promise<{ success: boolean; value: string | null }> {
    const client = getUpstashRedisClient()
    if (!client) {
        console.error(
            "Failed to get KV: Upstash Redis client not found. This should never happen."
        )

        return { success: false, value: null }
    }

    try {
        return { success: true, value: await client.get(key) }
    } catch {
        console.error(`Failed to get KV: ${key}`)

        return { success: false, value: null }
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

async function getKvBoolean({
    key
}: {
    key: string
}): Promise<
    { success: true; value: boolean | null } | { success: false; value: null }
> {
    const { success, value } = await getKv({ key })
    if (!success) return { success: false, value: null }

    if (!value) return { success: true, value: null }

    if (value !== "1" && value !== "0") {
        console.error(
            `Failed to get KV boolean: Invalid value for key "${key}". Expected "1" or "0".`
        )

        return { success: false, value: null }
    }

    return { success: true, value: value === "1" }
}

async function toggleKvBoolean({
    previous,

    key
}: {
    previous?: boolean

    key: string
}): Promise<
    { success: true; value: boolean } | { success: false; value: null }
> {
    const resolvedPrevious =
        previous === undefined
            ? await getKvBoolean({ key })
            : { success: true, value: previous }

    if (!resolvedPrevious.success) {
        console.error(
            `Failed to toggle KV boolean: failed to get previous value for key "${key}".`
        )

        return { success: false, value: null }
    }

    const nextValue = resolvedPrevious.value ? !resolvedPrevious.value : true

    const { success } = await setKvBoolean({ key, value: nextValue })
    if (!success) return { success: false, value: null }

    return { success: true, value: nextValue }
}

export { getKv, getKvBoolean, setKv, setKvBoolean, toggleKvBoolean }
