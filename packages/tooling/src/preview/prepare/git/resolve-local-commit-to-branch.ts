import { readGit } from "./read"

function resolveLocalCommitToBranch(commit: string): string | null {
    const output = readGit([
        "branch",
        "--contains",
        commit,
        "--format",
        "%(refname:short)"
    ])

    if (!output) return null

    const currentBranch = readGit(["branch", "--show-current"])
    const branches = output
        .split("\n")
        .map(value => value.trim())
        .filter(Boolean)

    if (currentBranch && branches.includes(currentBranch)) return currentBranch

    return branches[0] ?? null
}

export { resolveLocalCommitToBranch }
