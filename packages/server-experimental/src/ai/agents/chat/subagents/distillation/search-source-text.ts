/**
 * @todo P3: Human review.
 */

type SourceSearchMatch = {
    term: string
    start: number
    end: number
    excerpt: string
}

type SearchSourceTextOptions = {
    caseSensitive?: boolean

    /**
     * Characters of surrounding context included in each excerpt.
     */
    excerptRadius?: number

    /**
     * Skip matches that overlap this span (typically the current chunk).
     */
    excludeRange?: {
        start: number
        end: number
    }
}

const DEFAULT_EXCERPT_RADIUS = 80

/**
 * Searches source text for terms that may sit outside the current chunk.
 */
const searchSourceText = (
    source: string,
    terms: string[],
    options: SearchSourceTextOptions = {}
): SourceSearchMatch[] => {
    const caseSensitive = options.caseSensitive ?? false
    const excerptRadius = options.excerptRadius ?? DEFAULT_EXCERPT_RADIUS
    const excludeRange = options.excludeRange
    const haystack = caseSensitive ? source : source.toLowerCase()

    const matches: SourceSearchMatch[] = []

    for (const term of terms) {
        if (term.length === 0) continue

        const needle = caseSensitive ? term : term.toLowerCase()
        let from = 0

        while (from < haystack.length) {
            const start = haystack.indexOf(needle, from)

            if (start === -1) break

            const end = start + needle.length
            from = end

            if (
                excludeRange &&
                start < excludeRange.end &&
                end > excludeRange.start
            )
                continue

            const excerptStart = Math.max(0, start - excerptRadius)
            const excerptEnd = Math.min(source.length, end + excerptRadius)

            matches.push({
                term,
                start,
                end,
                excerpt: source.slice(excerptStart, excerptEnd)
            })
        }
    }

    return matches.sort((a, b) => a.start - b.start)
}

export {
    DEFAULT_EXCERPT_RADIUS,
    type SearchSourceTextOptions,
    type SourceSearchMatch,
    searchSourceText
}
