import { type } from "arktype"

const ACTION_PALETTE_COMMAND_NAME = "action-palette"

const GLOBAL_CACHE_NAMESPACE = "*"

/**
 * @todo P3: Uninstall ArkType once we consolidate this to a package.
 */
const actionPaletteLaunchContextSchema = type({
    actionId: "string"
})

type ActionPaletteLaunchContext = typeof actionPaletteLaunchContextSchema.infer

export {
    ACTION_PALETTE_COMMAND_NAME,
    type ActionPaletteLaunchContext,
    actionPaletteLaunchContextSchema,
    GLOBAL_CACHE_NAMESPACE
}
