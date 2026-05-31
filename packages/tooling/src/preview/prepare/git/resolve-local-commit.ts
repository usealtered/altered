import { readGit } from "./read"

const WHITESPACE_PATTERN = /\s/

function resolveLocalCommit(ref: string): string {
    const normalizedRef = ref.trim()
    if (!normalizedRef) throw new Error("Reference cannot be empty.")

    if (WHITESPACE_PATTERN.test(normalizedRef))
        throw new Error(
            `Reference '${normalizedRef}' is invalid. References cannot contain spaces.`
        )

    try {
        return readGit(["rev-parse", "--verify", `${normalizedRef}^{commit}`])
    } catch {
        throw new Error(
            `Reference '${normalizedRef}' is invalid or unavailable locally.`
        )
    }
}

export { resolveLocalCommit }
