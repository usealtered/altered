import { readGit } from "./read"

function validateBranchName(branch: string): void {
    try {
        readGit(["check-ref-format", "--branch", branch])
    } catch {
        throw new Error(`Branch '${branch}' is not a valid Git branch name.`)
    }
}

export { validateBranchName }
