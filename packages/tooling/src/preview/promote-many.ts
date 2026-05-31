import {
    type PreviewDeploymentApplicationName,
    type PromotePreviewDeploymentOptions,
    type PromotePreviewDeploymentResult,
    promotePreviewDeployment
} from "./promote"

type PromotePreviewDeploymentsOptions = Omit<
    PromotePreviewDeploymentOptions,
    "applicationTarget"
> & {
    applicationTargets: PreviewDeploymentApplicationName[]
}

type PromotePreviewDeploymentsResult = PromiseSettledResult<
    PromotePreviewDeploymentResult & {
        applicationTarget: PreviewDeploymentApplicationName
    }
>

function promotePreviewDeployments({
    applicationTargets,

    ...options
}: PromotePreviewDeploymentsOptions): Promise<
    PromotePreviewDeploymentsResult[]
> {
    return Promise.allSettled(
        applicationTargets.map(async applicationTarget => {
            const result = await promotePreviewDeployment({
                ...options,

                applicationTarget
            })

            return {
                ...result,

                applicationTarget
            }
        })
    )
}

export { type PromotePreviewDeploymentsResult, promotePreviewDeployments }
