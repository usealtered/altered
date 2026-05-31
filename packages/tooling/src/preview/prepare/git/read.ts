import { execFileSync } from "node:child_process"

function readGit(args: string[]): string {
    return execFileSync("git", args, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"]
    }).trim()
}

export { readGit }
