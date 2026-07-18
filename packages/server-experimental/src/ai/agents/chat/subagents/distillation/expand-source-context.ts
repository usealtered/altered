/**
 * @todo P3: Human review.
 */

import type { SourceChunk } from "./split-source"

type ExpansionDirection = "before" | "after" | "both"
type ExpansionUnit = "characters" | "words" | "chunks"

type ExpandSourceContextInput = {
    source: string
    start: number
    end: number
    direction: ExpansionDirection
    amount: number
    unit: ExpansionUnit

    /**
     * Required when `unit` is `chunks`.
     */
    chunks?: SourceChunk[]
}

type ExpandedSourceContext = {
    start: number
    end: number
    before: string
    target: string
    after: string
    text: string
}

/**
 * Expands a source span directionally for distillation context gathering.
 */
const expandSourceContext = (
    input: ExpandSourceContextInput
): ExpandedSourceContext => {
    const { source, start, end, direction, amount, unit, chunks } = input

    const clampedStart = clamp(start, 0, source.length)
    const clampedEnd = clamp(end, clampedStart, source.length)

    let nextStart = clampedStart
    let nextEnd = clampedEnd

    if (direction === "before" || direction === "both")
        nextStart = expandBefore(source, clampedStart, amount, unit, chunks)

    if (direction === "after" || direction === "both")
        nextEnd = expandAfter(source, clampedEnd, amount, unit, chunks)

    const before = source.slice(nextStart, clampedStart)
    const target = source.slice(clampedStart, clampedEnd)
    const after = source.slice(clampedEnd, nextEnd)

    return {
        start: nextStart,
        end: nextEnd,
        before,
        target,
        after,
        text: before + target + after
    }
}

const expandBefore = (
    source: string,
    start: number,
    amount: number,
    unit: ExpansionUnit,
    chunks: SourceChunk[] | undefined
): number => {
    if (amount <= 0) return start
    if (unit === "characters") return Math.max(0, start - amount)
    if (unit === "words") return moveByWordsBefore(source, start, amount)

    return moveByChunksBefore(start, amount, chunks)
}

const expandAfter = (
    source: string,
    end: number,
    amount: number,
    unit: ExpansionUnit,
    chunks: SourceChunk[] | undefined
): number => {
    if (amount <= 0) return end
    if (unit === "characters") return Math.min(source.length, end + amount)
    if (unit === "words") return moveByWordsAfter(source, end, amount)

    return moveByChunksAfter(source.length, end, amount, chunks)
}

const moveByWordsBefore = (
    source: string,
    start: number,
    amount: number
): number => {
    let cursor = skipWhitespaceBefore(source, start)

    for (let n = 0; n < amount && cursor > 0; n += 1) {
        cursor = skipWhitespaceBefore(source, cursor)
        cursor = skipWordBefore(source, cursor)
    }

    return cursor
}

const moveByWordsAfter = (
    source: string,
    end: number,
    amount: number
): number => {
    let cursor = skipWhitespaceAfter(source, end)

    for (let n = 0; n < amount && cursor < source.length; n += 1) {
        cursor = skipWordAfter(source, cursor)
        cursor = skipWhitespaceAfter(source, cursor)
    }

    return cursor
}

const moveByChunksBefore = (
    start: number,
    amount: number,
    chunks: SourceChunk[] | undefined
): number => {
    if (!chunks || chunks.length === 0) return start

    const index = chunks.findIndex(
        chunk => chunk.start <= start && start < chunk.end
    )
    const from = index === -1 ? 0 : Math.max(0, index - amount)

    return chunks[from]?.start ?? start
}

const moveByChunksAfter = (
    sourceLength: number,
    end: number,
    amount: number,
    chunks: SourceChunk[] | undefined
): number => {
    if (!chunks || chunks.length === 0) return end

    const index = chunks.findLastIndex(
        chunk => chunk.start < end && end <= chunk.end
    )
    const to =
        index === -1
            ? chunks.length - 1
            : Math.min(chunks.length - 1, index + amount)

    return chunks[to]?.end ?? sourceLength
}

const isWhitespace = (character: string | undefined): boolean =>
    character === " " ||
    character === "\n" ||
    character === "\t" ||
    character === "\r"

const skipWhitespaceBefore = (source: string, index: number): number => {
    let cursor = index

    while (cursor > 0 && isWhitespace(source.at(cursor - 1))) cursor -= 1

    return cursor
}

const skipWordBefore = (source: string, index: number): number => {
    let cursor = index

    while (cursor > 0 && !isWhitespace(source.at(cursor - 1))) cursor -= 1

    return cursor
}

const skipWhitespaceAfter = (source: string, index: number): number => {
    let cursor = index

    while (cursor < source.length && isWhitespace(source.at(cursor)))
        cursor += 1

    return cursor
}

const skipWordAfter = (source: string, index: number): number => {
    let cursor = index

    while (cursor < source.length && !isWhitespace(source.at(cursor)))
        cursor += 1

    return cursor
}

const clamp = (value: number, min: number, max: number): number =>
    Math.min(max, Math.max(min, value))

export {
    type ExpandedSourceContext,
    type ExpandSourceContextInput,
    type ExpansionDirection,
    type ExpansionUnit,
    expandSourceContext
}
