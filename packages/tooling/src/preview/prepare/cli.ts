import { parseArgs } from "node:util"
import {
    APPLICATION_NAMES,
    type PreviewDeploymentApplicationName
} from "../promote"

function parseCliArguments() {
    const { values } = parseArgs({
        strict: true,
        allowPositionals: false,

        options: {
            app: { type: "string", short: "a" },
            branch: { type: "string", short: "b" },
            commit: { type: "string", short: "c" }
        }
    })

    if (
        !values.app ||
        !APPLICATION_NAMES.includes(
            values.app as PreviewDeploymentApplicationName
        )
    )
        throw new Error(
            `Missing or invalid application name. ${cliUsageInstructions}`
        )

    const app = values.app as PreviewDeploymentApplicationName

    return {
        ...values,

        app
    }
}

const cliUsageInstructions =
    "Usage: altered-preview-promote [--app 'api-experimental'] [--branch <branch-name> | --commit <commit-sha>]."

export { cliUsageInstructions, parseCliArguments }
