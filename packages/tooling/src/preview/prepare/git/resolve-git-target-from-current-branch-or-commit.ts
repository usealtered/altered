import { cliUsageInstructions } from "../cli"
import { assertLocalBranchExists } from "./assert-local-branch-exists"
import { assertRemoteCommitExists } from "./assert-remote-commit-exists"
import { readGit } from "./read"
import { resolveLatestRemoteBranchCommit } from "./resolve-latest-remote-branch-commit"
import { resolveLocalCommit } from "./resolve-local-commit"
import { resolveLocalCommitToBranch } from "./resolve-local-commit-to-branch"
import { validateBranchName } from "./validate-branch-name"

async function resolveGitTargetFromCurrentBranchOrCommit(
    branch: string | undefined,
    commit: string | undefined,
    { githubToken }: { githubToken: string }
): Promise<{
    branch?: string
    commit: string
}> {
    if (branch && commit)
        throw new Error(
            `Provide either --branch or --commit, not both. ${cliUsageInstructions}`
        )

    if (commit) {
        const localCommit = resolveLocalCommit(commit)

        await assertRemoteCommitExists(localCommit, { githubToken })

        const resolvedBranch = resolveLocalCommitToBranch(localCommit)

        if (resolvedBranch) {
            validateBranchName(resolvedBranch)
            assertLocalBranchExists(resolvedBranch)

            return {
                branch: resolvedBranch,
                commit: localCommit
            }
        }

        return { commit: localCommit }
    }

    const resolvedBranch = branch ?? readGit(["branch", "--show-current"])

    if (!resolvedBranch)
        throw new Error(
            `Could not resolve current branch (detached HEAD). Provide --branch explicitly. ${cliUsageInstructions}`
        )

    validateBranchName(resolvedBranch)
    assertLocalBranchExists(resolvedBranch)

    if (resolvedBranch === "main")
        throw new Error(
            `Promoting the 'main' branch is not allowed. Please switch to another branch or provide an explicit reference. ${cliUsageInstructions}`
        )

    const latestLocalBranchCommit = resolveLocalCommit(resolvedBranch)

    const latestRemoteBranchCommit =
        resolveLatestRemoteBranchCommit(resolvedBranch)

    if (latestLocalBranchCommit !== latestRemoteBranchCommit)
        throw new Error(
            `Branch '${resolvedBranch}' exists on origin, but commit '${latestLocalBranchCommit}' is not the latest remote branch commit ('${latestRemoteBranchCommit}'). Push the branch before starting a deployment.`
        )

    return {
        branch: resolvedBranch,
        commit: latestLocalBranchCommit
    }
}

export { resolveGitTargetFromCurrentBranchOrCommit }
