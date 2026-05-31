function getEnvironmentVariables() {
    const githubRepositoryId = process.env.SHARED_PROVIDER_GITHUB_REPOSITORY_ID
    if (!githubRepositoryId)
        throw new Error(
            "Missing SHARED_PROVIDER_GITHUB_REPOSITORY_ID environment variable."
        )

    const githubToken = process.env.SHARED_PROVIDER_GITHUB_SECRET
    if (!githubToken)
        throw new Error(
            "Missing SHARED_PROVIDER_GITHUB_SECRET environment variable."
        )

    const vercelTeamId = process.env.SHARED_PROVIDER_VERCEL_TEAM_ID
    if (!vercelTeamId)
        throw new Error(
            "Missing SHARED_PROVIDER_VERCEL_TEAM_ID environment variable."
        )

    const vercelToken = process.env.SHARED_PROVIDER_VERCEL_SECRET
    if (!vercelToken)
        throw new Error(
            "Missing SHARED_PROVIDER_VERCEL_SECRET environment variable."
        )

    return {
        githubRepositoryId,
        githubToken,

        vercelTeamId,
        vercelToken
    }
}

export { getEnvironmentVariables }
