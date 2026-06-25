import type { ALTEREDInterface } from "./interfaces/definitions"

const actionPaletteInterfaces = [
    {
        type: "collection",

        content: [
            {
                id: "altered-onboarding",

                alias: "ALTERED Onboarding",
                content: "Learn how to set up and use your ALTERED Brain.",

                icon: "info-01-16",

                interfaces: [
                    {
                        type: "markdown",
                        content: "# ALTERED Onboarding\n\nNot implemented."
                    }
                ]
            },

            {
                id: "view-thoughts",

                alias: "View Thoughts",
                content: "View and manage the thoughts in your ALTERED Brain.",

                icon: "speech-bubble-16",

                triggerPhrase: "v",

                interfaces: [
                    {
                        type: "collection",

                        content: [
                            {
                                id: "distill-message-tool-poc",

                                alias: "Distill Message Tool POC",
                                content:
                                    "We should implement a basic message distillation tool that allows our chat agent to ingest user messages to their ALTERED brain."
                            },

                            {
                                id: "query-memory-tool-poc",

                                alias: "Query Memory Tool POC",
                                content:
                                    "We should implement a basic memory querying tool that allows our chat agent to fetch thoughts from the user's ALTERED brain for context about a specific topic, scope, or intent."
                            }
                        ]
                    }
                ]
            }
        ]
    }
] satisfies ALTEREDInterface[]

export { actionPaletteInterfaces }
