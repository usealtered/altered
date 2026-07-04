import { tool } from "ai"
import { type } from "arktype"

type Definition = {
    id: string
    name: string
    description: string
}

const applicationTargetDemographicIds = ["public", "internal"] as const

type ApplicationTargetDemographicID =
    (typeof applicationTargetDemographicIds)[number]

const applicationTargetDemographicDefinitions = {
    public: {
        id: "public",
        name: "Public",
        description: "The default, publicly available build variant."
    },

    internal: {
        id: "internal",
        name: "Internal",
        description: "The internal build variant for ALTERED team members."
    }
} as const satisfies Record<ApplicationTargetDemographicID, Definition>

const applicationTargetStageIds = [
    "stable",
    "pre-release",
    "experimental"
] as const

type ApplicationTargetStageID = (typeof applicationTargetStageIds)[number]

const applicationTargetStageDefinitions = {
    stable: {
        id: "stable",
        name: "Stable",
        description: "The build variant for concrete releases."
    },

    "pre-release": {
        id: "pre-release",
        name: "Pre-Release",
        description:
            "The build variant for safe, early-access validation and change set solidification."
    },

    experimental: {
        id: "experimental",
        name: "Experimental",
        description:
            "The build variant for unstable/experimental feature testing."
    }
} as const satisfies Record<ApplicationTargetStageID, Definition>

const applicationTargetEnvironmentIds = [
    "production",
    "preview",
    "development"
] as const

type ApplicationTargetEnvironmentID =
    (typeof applicationTargetEnvironmentIds)[number]

const applicationTargetEnvironmentDefinitions = {
    production: {
        id: "production",
        name: "Production",
        description: "The build variant deployed to production."
    },

    preview: {
        id: "preview",
        name: "Preview",
        description:
            "The build variant deployed to the 'preview' subdomain for feature branch testing."
    },

    development: {
        id: "development",
        name: "Development",
        description:
            "The build variant running locally, accessible via a tunnel."
    }
} as const satisfies Record<ApplicationTargetEnvironmentID, Definition>

const applicationTargetIds = [
    "public-experimental-production",
    "public-experimental-preview",
    "public-experimental-development"
] as const satisfies `${ApplicationTargetDemographicID}-${ApplicationTargetStageID}-${ApplicationTargetEnvironmentID}`[]

type ApplicationTargetID = (typeof applicationTargetIds)[number]

const applicationTargetIdSchemaDescription = `
Application target ID.

Select one of the available application targets that requests should be routed to. Each target ID is composed as:

\`<demographic>-<stage>-<environment>\`

Available targets:
${applicationTargetIds.map(id => `- \`${id}\``).join("\n")}

ID components:

Demographics:
${Object.values(applicationTargetDemographicDefinitions)
    .map(definition => `- \`${definition.id}\`: ${definition.description}`)
    .join("\n")}

Stages:
${Object.values(applicationTargetStageDefinitions)
    .map(definition => `- \`${definition.id}\`: ${definition.description}`)
    .join("\n")}

Environments:
${Object.values(applicationTargetEnvironmentDefinitions)
    .map(definition => `- \`${definition.id}\`: ${definition.description}`)
    .join("\n")}
`.trim()

const applicationTargetIdSchema = type("===", ...applicationTargetIds).describe(
    applicationTargetIdSchemaDescription,
    "union"
)

function createChangeApplicationTargetTool() {
    return tool({
        title: "Change Application Target",
        description: "Change the deployment that requests should be routed to.",

        inputSchema: type({
            id: applicationTargetIdSchema
        }),

        outputSchema: type({
            success: type("boolean").describe(
                "Whether the operation was successful."
            )
        }),

        execute: ({ id }) => {
            console.log(
                "[ai:agents:chat:tools:change-application-target] Tool called:",
                JSON.stringify({ id }, null, 2)
            )

            return {
                success: true
            }
        }
    })
}

export {
    type ApplicationTargetDemographicID,
    type ApplicationTargetEnvironmentID,
    type ApplicationTargetID,
    type ApplicationTargetStageID,
    applicationTargetDemographicDefinitions,
    applicationTargetDemographicIds,
    applicationTargetEnvironmentDefinitions,
    applicationTargetEnvironmentIds,
    applicationTargetIdSchema,
    applicationTargetIds,
    applicationTargetStageDefinitions,
    applicationTargetStageIds,
    createChangeApplicationTargetTool
}
