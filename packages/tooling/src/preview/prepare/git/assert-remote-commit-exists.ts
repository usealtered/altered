import { parseGitHubRemoteUrlRepositoryPath } from "./parse-github-remote-url-repository-path"
import { readGit } from "./read"

async function assertRemoteCommitExists(
    commit: string,
    { githubToken }: { githubToken: string }
): Promise<void> {
    const repositoryPath = parseGitHubRemoteUrlRepositoryPath(
        readGit(["remote", "get-url", "origin"])
    )

    const response = await fetch(
        `https://api.github.com/repos/${repositoryPath}/commits/${commit}`,
        {
            headers: {
                accept: "application/vnd.github+json",
                authorization: `Bearer ${githubToken}`
            }
        }
    )

    if (response.ok) return

    throw new Error(`Commit '${commit}' does not exist on GitHub remote.`)
}

export { assertRemoteCommitExists }
