import { Vercel } from "@vercel/sdk"

const APPLICATION_NAMES = ["api-experimental"] as const

type PreviewDeploymentApplicationName = (typeof APPLICATION_NAMES)[number]

type PreviewDeploymentConfig = {
    branch: string
    vercelProjectName: string
    domain: string
}

const PREVIEW_DEPLOYMENT_CONFIGURATIONS: Record<
    PreviewDeploymentApplicationName,
    PreviewDeploymentConfig
> = {
    "api-experimental": {
        branch: "preview/api-experimental",
        vercelProjectName: "api-experimental",
        domain: "preview.experimental.api.usealtered.com"
    }
}

type PromotePreviewDeploymentOptions = {
    appName: PreviewDeploymentApplicationName

    githubRepositoryId: string
    branchRef?: string
    commitSha: string

    vercelToken: string
    vercelTeamId: string
}

type PromotePreviewDeploymentRequirements =
    Required<PromotePreviewDeploymentOptions>

type PromotePreviewDeploymentResult = {
    deploymentId: string
    deploymentUrl: string
}

async function createDeployment({
    reqs,
    vercel
}: {
    reqs: PromotePreviewDeploymentRequirements
    vercel: Vercel
}): Promise<{ id: string; url: string }> {
    const { appName, githubRepositoryId, branchRef, commitSha, vercelTeamId } =
        reqs

    const response = await vercel.deployments.createDeployment({
        teamId: vercelTeamId,
        requestBody: {
            name: appName,
            gitSource: {
                type: "github",
                repoId: githubRepositoryId,
                ref: branchRef,
                sha: commitSha
            }
        },

        skipAutoDetectionConfirmation: "1"
    })

    return { id: response.id, url: response.url }
}

async function waitForDeploymentReady({
    deploymentId,
    reqs,
    vercel
}: {
    deploymentId: string
    reqs: PromotePreviewDeploymentRequirements
    vercel: Vercel
}): Promise<void> {
    const { vercelTeamId } = reqs

    const POLLING_INTERVAL_MS = 5000
    const POLLING_ATTEMPTS_COUNT = 60

    for (let attempts = 1; attempts <= POLLING_ATTEMPTS_COUNT; attempts++) {
        const response = await vercel.deployments.getDeployment({
            idOrUrl: deploymentId,
            teamId: vercelTeamId
        })

        if (response.readyState === "READY") return

        if (
            response.readyState === "ERROR" ||
            response.readyState === "CANCELED"
        )
            throw new Error(
                `Deployment ${deploymentId} ended in terminal state: ${response.readyState}.`
            )

        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS))
    }

    throw new Error(
        `Timed out waiting for deployment ${deploymentId} to become READY.`
    )
}

async function assignPreviewDomainAlias({
    deploymentId,
    config,
    reqs,
    vercel
}: {
    deploymentId: string
    config: PreviewDeploymentConfig
    reqs: PromotePreviewDeploymentRequirements
    vercel: Vercel
}): Promise<void> {
    const { vercelTeamId } = reqs
    const { domain } = config

    await vercel.aliases.assignAlias({
        id: deploymentId,
        teamId: vercelTeamId,
        requestBody: {
            alias: domain,
            redirect: null
        }
    })
}

async function promotePreviewDeployment(
    options: PromotePreviewDeploymentOptions
): Promise<PromotePreviewDeploymentResult> {
    const config = PREVIEW_DEPLOYMENT_CONFIGURATIONS[options.appName]

    const reqs: PromotePreviewDeploymentRequirements = {
        ...options,

        branchRef: options.branchRef ?? config.branch
    }

    const vercel = new Vercel({ bearerToken: reqs.vercelToken })

    const { id: deploymentId, url: deploymentUrl } = await createDeployment({
        reqs,
        vercel
    })

    await waitForDeploymentReady({
        deploymentId,
        reqs,
        vercel
    })

    await assignPreviewDomainAlias({
        deploymentId,
        config,
        reqs,
        vercel
    })

    return {
        deploymentId,
        deploymentUrl
    }
}

export {
    APPLICATION_NAMES,
    type PreviewDeploymentApplicationName,
    promotePreviewDeployment
}
