import type { PromotePreviewDeploymentsResult } from "./promote-many"

function printDeploymentResults(
    deploymentResults: PromotePreviewDeploymentsResult[]
): void {
    const failedDeploymentResults = deploymentResults.filter(
        deploymentResult => deploymentResult.status === "rejected"
    )

    for (const deploymentResult of deploymentResults)
        if (deploymentResult.status === "fulfilled")
            console.log(
                `Preview deployment created for target '${deploymentResult.value.applicationTarget}': ${deploymentResult.value.inspectorUrl}`
            )

    if (failedDeploymentResults.length) {
        for (const failedDeploymentResult of failedDeploymentResults) {
            const deploymentError = failedDeploymentResult.reason

            const errorMessage =
                deploymentError instanceof Error
                    ? deploymentError.message
                    : String(deploymentError)

            console.error(`Preview deployment failed: ${errorMessage}`)
        }

        process.exitCode = 1
    }
}

export { printDeploymentResults }
