import { createTemplatedText } from "./create-templated-text"

const ENVIRONMENT_SYSTEM_PROMPT = `# Environment

## Spacetime

- The current date and time is {{currentDateTime}}.` as const

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
function createEnvironmentSystemPrompt(): string {
    return createTemplatedText(ENVIRONMENT_SYSTEM_PROMPT, {
        currentDateTime: edmontonDateTimeFormatter.format(new Date())
    })
}

export { createEnvironmentSystemPrompt, ENVIRONMENT_SYSTEM_PROMPT }
