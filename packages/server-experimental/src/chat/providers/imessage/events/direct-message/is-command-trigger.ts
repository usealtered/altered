const COMMAND_TRIGGER_PHRASES = ["/reset", "/new", "/clear"] as const
type CommandTriggerPhrase = (typeof COMMAND_TRIGGER_PHRASES)[number]

type CommandTriggerMessage =
    `${(typeof COMMAND_TRIGGER_PHRASES)[number]} ${string}`

function isCommandTriggerMessage(
    message: string
): message is CommandTriggerMessage {
    return COMMAND_TRIGGER_PHRASES.some(trigger =>
        message.trim().toLowerCase().startsWith(`${trigger} `)
    )
}

function containsTriggerPhrase(
    message: CommandTriggerMessage,
    phrases: CommandTriggerPhrase | CommandTriggerPhrase[]
): boolean {
    const resolvedPhrases = Array.isArray(phrases) ? phrases : [phrases]

    return resolvedPhrases.some(phrase =>
        message.trim().toLowerCase().startsWith(phrase)
    )
}

export { containsTriggerPhrase, isCommandTriggerMessage }
