import type { LaunchProps } from "@raycast/api"
import { ArkErrors, type } from "arktype"

function resolveLaunchContext<const Schema>(
    context: LaunchProps["launchContext"],
    { schema }: { schema: type.validate<Schema> }
): type.infer.Out<Schema> | null {
    const optionalSchema = type.raw(schema).or("undefined")

    const parsedContext = optionalSchema(context)

    if (parsedContext instanceof ArkErrors)
        console.warn("Invalid launch context, ignoring.", {
            summary: parsedContext.summary
        })
    else if (parsedContext)
        console.log("Launch context detected:", { context: parsedContext })

    const safeContext =
        parsedContext instanceof ArkErrors ? null : parsedContext

    return safeContext
}

export { resolveLaunchContext }
