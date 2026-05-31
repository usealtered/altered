import { Vercel } from "@vercel/sdk"

const APPLICATION_NAMES = ["api-experimental"] as const
type PreviewDeploymentApplicationName = (typeof APPLICATION_NAMES)[number]

type PreviewDeploymentConfig = {
    vercelScopeSlug: string
    vercelProjectName: PreviewDeploymentApplicationName

    domain: string
}

const PREVIEW_DEPLOYMENT_CONFIGURATIONS: Record<
    PreviewDeploymentApplicationName,
    PreviewDeploymentConfig
> = {
    "api-experimental": {
        vercelScopeSlug: "altered",
        vercelProjectName: "api-experimental",
        domain: "preview.experimental.api.usealtered.com"
    }
}

type PromotePreviewDeploymentOptions = {
    appName: PreviewDeploymentApplicationName

    gitBranch?: string
    gitCommit: string

    githubRepositoryId: string

    vercelToken: string
    vercelTeamId: string
}

type PromotePreviewDeploymentResult = {
    deploymentId: string

    inspectorUrl: string
}

function createDeploymentInspectorUrl({
    scopeSlug,
    projectName,
    deploymentId
}: {
    scopeSlug: string
    projectName: string
    deploymentId: string
}): string {
    return `https://vercel.com/${scopeSlug}/${projectName}/${deploymentId}`
}

async function createDeployment({
    config,
    options,
    vercel
}: {
    config: PreviewDeploymentConfig
    options: PromotePreviewDeploymentOptions
    vercel: Vercel
}): Promise<{ id: string; url: string }> {
    const { vercelProjectName } = config
    const { githubRepositoryId, gitBranch, gitCommit, vercelTeamId } = options

    const response = await vercel.deployments.createDeployment({
        teamId: vercelTeamId,
        requestBody: {
            name: vercelProjectName,
            gitSource: {
                type: "github",
                repoId: githubRepositoryId,

                ...(gitBranch
                    ? {
                          ref: gitBranch,
                          sha: gitCommit
                      }
                    : {
                          ref: gitCommit
                      })
            }
        },

        skipAutoDetectionConfirmation: "1"
    })

    return { id: response.id, url: response.url }
}

async function waitForDeploymentReady({
    deploymentId,
    options,
    vercel
}: {
    deploymentId: string
    options: PromotePreviewDeploymentOptions
    vercel: Vercel
}): Promise<void> {
    const { vercelTeamId } = options

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
    options,
    vercel
}: {
    deploymentId: string
    config: PreviewDeploymentConfig
    options: PromotePreviewDeploymentOptions
    vercel: Vercel
}): Promise<void> {
    const { domain } = config
    const { vercelTeamId } = options

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

    const vercel = new Vercel({ bearerToken: options.vercelToken })

    const { id: deploymentId } = await createDeployment({
        config,
        options,
        vercel
    })

    await waitForDeploymentReady({
        deploymentId,
        options,
        vercel
    })

    await assignPreviewDomainAlias({
        deploymentId,
        config,
        options,
        vercel
    })

    return {
        deploymentId,

        inspectorUrl: createDeploymentInspectorUrl({
            scopeSlug: config.vercelScopeSlug,
            projectName: config.vercelProjectName,
            deploymentId
        })
    }
}

export {
    APPLICATION_NAMES,
    type PreviewDeploymentApplicationName,
    type PromotePreviewDeploymentOptions,
    promotePreviewDeployment
}
