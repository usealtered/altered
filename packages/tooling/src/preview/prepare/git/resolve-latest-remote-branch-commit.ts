import { readGit } from "./read"

const TAB_PATTERN = /\t/

function resolveLatestRemoteBranchCommit(branch: string): string {
    const output = readGit(["ls-remote", "--heads", "origin", branch])

    const [remoteCommit, _remoteBranch] = output.split(TAB_PATTERN)

    if (!remoteCommit)
        throw new Error(`Branch '${branch}' does not exist on GitHub remote.`)

    return remoteCommit
}

export { resolveLatestRemoteBranchCommit }
