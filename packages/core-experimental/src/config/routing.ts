type ConfigTarget = "api" | "web" | "launcher"

const CONFIG_ENVIRONMENTS = ["production", "preview", "development"] as const
type ConfigEnvironment = (typeof CONFIG_ENVIRONMENTS)[number]

/**
 * @todo P0: Convert to Effect Config.
 */
function resolveEnvironment({
    target
}: {
    target: ConfigTarget
}): ConfigEnvironment {
    const sharedEnv = process.env.SHARED_CONFIG_ENV?.trim()
    const targetEnv = process.env[`${target.toUpperCase()}_CONFIG_ENV`]?.trim()

    const resolvedEnv = sharedEnv || targetEnv

    if (
        !resolvedEnv ||
        !CONFIG_ENVIRONMENTS.includes(resolvedEnv as ConfigEnvironment)
    )
        throw new Error(
            `'SHARED_CONFIG_ENV' or '${target.toUpperCase()}_CONFIG_ENV' environment variables are missing or invalid.`
        )

    return resolvedEnv as ConfigEnvironment
}

/**
 * @todo
 * - P2: Add preview origin handling.
 * - P0: Convert to Effect Config.
 */
function resolveApiOrigin({ target }: { target: ConfigTarget }): string {
    const env = resolveEnvironment({ target })

    const origin = process.env[`${target.toUpperCase()}_ORIGIN_${env}`]?.trim()

    if (!origin) {
        if (env === "development") {
            const tunnel = process.env.SHARED_PROVIDER_NGROK_URL?.trim()
            if (!tunnel)
                throw new Error(
                    "'SHARED_PROVIDER_NGROK_URL' environment variable is missing."
                )

            return tunnel
        }

        throw new Error(
            `'${target.toUpperCase()}_ORIGIN_${env}' environment variable is missing.`
        )
    }

    return origin
}

export { resolveApiOrigin, resolveEnvironment }
