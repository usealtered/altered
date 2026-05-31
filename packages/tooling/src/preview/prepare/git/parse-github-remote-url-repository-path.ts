const GITHUB_SSH_REMOTE_URL_PATH_PATTERN =
    /^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/
const GITHUB_HTTPS_REMOTE_URL_PATH_PATTERN =
    /^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/

function parseGitHubRemoteUrlRepositoryPath(url: string): string {
    const sshPath = url.match(GITHUB_SSH_REMOTE_URL_PATH_PATTERN)
    const httpsPath = url.match(GITHUB_HTTPS_REMOTE_URL_PATH_PATTERN)

    const path = sshPath?.[1] ?? httpsPath?.[1]

    if (!path)
        throw new Error(
            `Unable to parse GitHub remote URL repository path from URL: ${url}`
        )

    return path
}

export { parseGitHubRemoteUrlRepositoryPath }
