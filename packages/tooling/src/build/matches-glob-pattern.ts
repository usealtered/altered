/**
 * Tests whether a string matches a glob pattern. Supports trailing wildcards.
 */
function matchesGlobPattern(string: string, pattern: string): boolean {
    if (!pattern.includes("*")) return string === pattern

    const expression = `^${pattern.replaceAll("/", "\\/").replaceAll("*", ".*")}$`

    return new RegExp(expression).test(string)
}

export { matchesGlobPattern }
