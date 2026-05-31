import { parseArgs } from "node:util"
import {
    APPLICATION_NAMES,
    type PreviewDeploymentApplicationName
} from "../promote"

function parseCliArguments(): {
    applicationTargets: PreviewDeploymentApplicationName[]

    gitBranch?: string
    gitCommit?: string
} {
    const {
        values: {
            target: applicationTargets,

            branch: gitBranch,
            commit: gitCommit
        }
    } = parseArgs({
        strict: true,
        allowPositionals: false,

        options: {
            target: {
                type: "string",
                short: "t",
                multiple: true
            },

            branch: { type: "string", short: "b" },
            commit: { type: "string", short: "c" }
        }
    })

    if (!applicationTargets?.length)
        throw new Error(`Missing application targets. ${cliUsageInstructions}`)

    if (
        applicationTargets.every(
            target =>
                APPLICATION_NAMES.includes(
                    target as PreviewDeploymentApplicationName
                ) || target === "*"
        ) === false
    )
        throw new Error(`Invalid application targets. ${cliUsageInstructions}`)

    const resolvedApplicationTargets = applicationTargets.includes("*")
        ? [...APPLICATION_NAMES]
        : ([
              ...new Set(applicationTargets)
          ] as PreviewDeploymentApplicationName[])

    return {
        applicationTargets: resolvedApplicationTargets,

        gitBranch,
        gitCommit
    }
}

const cliUsageInstructions =
    "Usage: altered-preview-promote --target <target> [--target <target> ...] [--branch <branch-name> | --commit <commit-sha>]."

export { cliUsageInstructions, parseCliArguments }
