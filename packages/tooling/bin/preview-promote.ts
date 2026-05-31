#!/usr/bin/env tsx

import { parseCliArguments } from "../src/preview/prepare/cli"
import { getEnvironmentVariables } from "../src/preview/prepare/environment"
import { resolveGitTargetFromCurrentBranchOrCommit } from "../src/preview/prepare/git/resolve-git-target-from-current-branch-or-commit"
import { promotePreviewDeployment } from "../src/preview/promote"

const { githubRepositoryId, githubToken, vercelTeamId, vercelToken } =
    getEnvironmentVariables()

const { app, branch, commit } = parseCliArguments()

const { branch: gitBranch, commit: gitCommit } =
    await resolveGitTargetFromCurrentBranchOrCommit(branch, commit, {
        githubToken
    })

const { inspectorUrl } = await promotePreviewDeployment({
    appName: app,

    gitBranch,
    gitCommit,

    githubRepositoryId,

    vercelTeamId,
    vercelToken
})

console.log(`Preview deployment created: ${inspectorUrl}`)
