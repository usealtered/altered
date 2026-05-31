#!/usr/bin/env tsx

import { parseCliArguments } from "../src/preview/prepare/cli"
import { getEnvironmentVariables } from "../src/preview/prepare/environment"
import { resolveGitTargetFromCurrentBranchOrCommit } from "../src/preview/prepare/git/resolve-git-target-from-current-branch-or-commit"
import { printDeploymentResults } from "../src/preview/print"
import { promotePreviewDeployments } from "../src/preview/promote-many"

const { githubRepositoryId, githubToken, vercelTeamId, vercelToken } =
    getEnvironmentVariables()

const { applicationTargets, gitBranch, gitCommit } = parseCliArguments()

const { branch: resolvedGitBranch, commit: resolvedGitCommit } =
    await resolveGitTargetFromCurrentBranchOrCommit(gitBranch, gitCommit, {
        githubToken
    })

const deploymentResults = await promotePreviewDeployments({
    applicationTargets,

    gitBranch: resolvedGitBranch,
    gitCommit: resolvedGitCommit,

    githubRepositoryId,

    vercelTeamId,
    vercelToken
})

printDeploymentResults(deploymentResults)
