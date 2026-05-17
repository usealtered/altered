import { build, type Plugin } from "esbuild"
import { includeMatchedPackages } from "./include-matched-packages"

/**
 * Bundles an ESM node application. Only inlines matched packages; rest remain external.
 */
async function bundleApplication(options: {
    /**
     * The entrypoint of the application.
     */
    entrypoint?: string

    /**
     * The package specifiers to match and inline.
     */
    include?: string[] | ((specifier: string) => boolean)

    /**
     * The destination for the bundled output.
     */
    outfile?: string

    /**
     * The working directory for path resolution.
     */
    workingDirectory?: string

    /**
     * Additional esbuild plugins to run after the package filter.
     */
    plugins?: Plugin[]
}) {
    const { entrypoint, include, outfile, workingDirectory, plugins } = {
        ...options,

        entrypoint: options?.entrypoint ?? "src/index.ts",
        include: options?.include ?? ["@altered/*"],
        outfile: options?.outfile ?? "dist/index.js",
        workingDirectory: options?.workingDirectory ?? process.cwd(),
        plugins: options?.plugins ?? []
    }

    await build({
        absWorkingDir: workingDirectory,
        entryPoints: [entrypoint],
        bundle: true,
        platform: "node",
        format: "esm",
        target: "esnext",
        conditions: ["bundler"],
        outfile,
        plugins: [
            includeMatchedPackages(include),

            ...plugins
        ]
    })
}

export { bundleApplication }
