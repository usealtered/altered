type SourceChunkKind = "sentence" | "length-fallback"

type SourceChunk = {
    index: number
    start: number
    end: number
    text: string
    kind: SourceChunkKind
}

type SplitSourceOptions = {
    /**
     * Character cutoff when sentence splitting fails for a span.
     *
     * @remarks Defaults to an approximate average sentence length.
     */
    fallbackLength?: number
}

const DEFAULT_FALLBACK_LENGTH = 120
const SENTENCE_END_PATTERN = /[.!?]["')\]]*(?:\s+|$)/

/**
 * Splits source text into sequential chunks for distillation.
 *
 * @remarks Prefers sentence boundaries. Falls back to a character cutoff near
 * word boundaries when a span cannot be split into sentences.
 */
const splitSourceIntoChunks = (
    source: string,
    options: SplitSourceOptions = {}
): SourceChunk[] => {
    const fallbackLength = options.fallbackLength ?? DEFAULT_FALLBACK_LENGTH

    if (source.length === 0) return []

    const chunks: SourceChunk[] = []
    let cursor = 0

    while (cursor < source.length) {
        const remaining = source.slice(cursor)
        const sentenceEnd = findSentenceEnd(remaining)

        if (sentenceEnd !== null) {
            const end = cursor + sentenceEnd
            const text = source.slice(cursor, end)

            if (text.trim().length > 0)
                chunks.push({
                    index: chunks.length,
                    start: cursor,
                    end,
                    text,
                    kind: "sentence"
                })

            cursor = end
            continue
        }

        if (remaining.length <= fallbackLength) {
            if (remaining.trim().length > 0)
                chunks.push({
                    index: chunks.length,
                    start: cursor,
                    end: source.length,
                    text: remaining,
                    kind: "length-fallback"
                })

            break
        }

        const cut = findFallbackCut(remaining, fallbackLength)
        const end = cursor + cut

        chunks.push({
            index: chunks.length,
            start: cursor,
            end,
            text: source.slice(cursor, end),
            kind: "length-fallback"
        })

        cursor = end
    }

    return chunks
}

const findSentenceEnd = (text: string): number | null => {
    const match = text.match(SENTENCE_END_PATTERN)

    if (!match || match.index === undefined) return null

    return match.index + match[0].length
}

const findFallbackCut = (text: string, fallbackLength: number): number => {
    const window = text.slice(0, fallbackLength)
    const lastSpace = window.lastIndexOf(" ")

    if (lastSpace > fallbackLength * 0.5) return lastSpace + 1

    return fallbackLength
}

export {
    DEFAULT_FALLBACK_LENGTH,
    type SourceChunk,
    type SourceChunkKind,
    type SplitSourceOptions,
    splitSourceIntoChunks
}
