import { readGit } from "./read"

function assertLocalBranchExists(branch: string): void {
    try {
        readGit(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`])
    } catch {
        throw new Error(`Branch '${branch}' does not exist locally.`)
    }
}

export { assertLocalBranchExists }
