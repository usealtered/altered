const COMMAND_TRIGGER_PHRASES = ["/reset", "/new", "/clear"] as const
type CommandTriggerPhrase = (typeof COMMAND_TRIGGER_PHRASES)[number]

function containsCommandTriggerPhrase({
    message,
    phrases = [...COMMAND_TRIGGER_PHRASES]
}: {
    message: string
    phrases?: CommandTriggerPhrase | CommandTriggerPhrase[]
}): boolean {
    const resolvedPhrases = Array.isArray(phrases) ? phrases : [phrases]

    return resolvedPhrases.some(phrase => {
        const cleanedMessage = message.trim().toLowerCase()

        const isTriggerPhrase = cleanedMessage === phrase
        const startsWithTriggerPhrase = cleanedMessage.startsWith(`${phrase} `)

        return isTriggerPhrase || startsWithTriggerPhrase
    })
}

export { containsCommandTriggerPhrase }
