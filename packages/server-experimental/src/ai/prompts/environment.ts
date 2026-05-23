import { createTemplatedText } from "./create-templated-text"

const ENVIRONMENT_SYSTEM_PROMPT = `# Environment

## Spacetime

- The current date and time is provided in an ephemeral message as \`CURRENT_DATE_TIME\`.` as const

const EPHEMERAL_ENVIRONMENT_SYSTEM_PROMPT =
    "CURRENT_DATE_TIME: {{currentDateTime}}" as const

const edmontonDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Edmonton",

    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
})

/**
 * @todo P1: Resolve to the user's local time rather than being fixed to Edmonton.
 */
function createEphemeralEnvironmentSystemPrompt(): string {
    return createTemplatedText(EPHEMERAL_ENVIRONMENT_SYSTEM_PROMPT, {
        currentDateTime: edmontonDateTimeFormatter.format(new Date())
    })
}

export { createEphemeralEnvironmentSystemPrompt, ENVIRONMENT_SYSTEM_PROMPT }
