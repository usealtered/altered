import type { Plugin } from "esbuild"
import { matchesGlobPattern } from "./matches-glob-pattern"

const matchAllPattern = /.*/

/**
 * Matches and inlines packages based on a matcher function or an array of globs.
 */
function includeMatchedPackages(
    matcher: string[] | ((specifier: string) => boolean)
): Plugin {
    let isMatch: (specifier: string) => boolean

    if (typeof matcher === "function") isMatch = matcher
    else
        isMatch = (specifier: string) =>
            matcher.some(pattern => matchesGlobPattern(specifier, pattern))

    return {
        name: "include-matched-packages",

        setup(build) {
            build.onResolve({ filter: matchAllPattern }, args => {
                if (isMatch(args.path)) return null

                if (
                    args.path.startsWith(".") ||
                    args.path.startsWith("/") ||
                    args.path.startsWith("node:")
                )
                    return null

                return { path: args.path, external: true }
            })
        }
    }
}

export { includeMatchedPackages }
