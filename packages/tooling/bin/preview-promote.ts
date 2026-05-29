#!/usr/bin/env tsx

import { parseArgs } from "node:util"
import {
    APPLICATION_NAMES,
    type PreviewDeploymentApplicationName,
    promotePreviewDeployment
} from "../src/preview/promote"

const { values, positionals } = parseArgs({
    strict: true,
    allowPositionals: true,

    options: {
        app: { type: "string" }
    }
})

const usageInstructions =
    "Usage: altered-preview-promote <commit-sha> [--app api-experimental]."

/**
 * @todo P3: Consider using the most recent commit as the default.
 */
const commitSha = positionals[0]
if (!commitSha) throw new Error(`Missing commit SHA. ${usageInstructions}`)

if (
    !values.app ||
    !APPLICATION_NAMES.includes(values.app as PreviewDeploymentApplicationName)
)
    throw new Error(`Missing or invalid application name. ${usageInstructions}`)

const appName = values.app as PreviewDeploymentApplicationName

const githubRepositoryId = process.env.SHARED_PROVIDERS_GITHUB_REPOSITORY_ID
if (!githubRepositoryId)
    throw new Error(
        "Missing SHARED_PROVIDER_GITHUB_REPOSITORY_ID environment variable."
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

const { deploymentId, deploymentUrl } = await promotePreviewDeployment({
    commitSha,
    appName,
    githubRepositoryId,
    vercelTeamId,
    vercelToken
})

console.log("Deployed Preview Successfully", {
    appName,
    commitSha,

    deploymentId,
    deploymentUrl
})
