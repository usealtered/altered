import type { Tool, TypedToolCall, TypedToolResult } from "ai"
import { createChangeApplicationTargetTool } from "./admin/change-application-target"
import { createChangeModelTool } from "./admin/change-model"
import { createDistillMessageTool } from "./mock-distill-thoughts"
import { createQueryMemoryTool } from "./mock-query-memory"

const chatToolNames = ["query-memory", "distill-message"] as const

type ChatToolName = (typeof chatToolNames)[number]

const chatAdminToolNames = [
    "change-application-target",
    "change-model"
] as const

type ChatAdminToolName = (typeof chatAdminToolNames)[number]

function isToolName<ToolName extends string>(
    actual: string,
    expected: readonly ToolName[]
): actual is ToolName {
    return expected.includes(actual as ToolName)
}

/**
 * Narrows tool names to the type of their designated tool set.
 *
 * @remarks We may need to prepend/append `tool` to the tool call names.
 */
function filterToolNames<ToolName extends string>(
    actual: string[],
    expected: readonly ToolName[]
): ToolName[] {
    return actual.filter(name => isToolName(name, expected))
}

const chatToolSet = {
    "query-memory": createQueryMemoryTool({
        include: {
            brains: {
                user: true,
                system: true
            }
        }
    }),

    "distill-message": createDistillMessageTool()
} satisfies Record<ChatToolName, Tool>

type ChatToolCall = TypedToolCall<typeof chatToolSet>
type ChatToolResult = TypedToolResult<typeof chatToolSet>

const chatAdminToolSet = {
    "change-application-target": createChangeApplicationTargetTool(),

    "change-model": createChangeModelTool()
} satisfies Record<ChatAdminToolName, Tool>

type ChatAdminToolCall = TypedToolCall<typeof chatAdminToolSet>
type ChatAdminToolResult = TypedToolResult<typeof chatAdminToolSet>

export {
    type ChatAdminToolCall,
    type ChatAdminToolName,
    type ChatAdminToolResult,
    type ChatToolCall,
    type ChatToolName,
    type ChatToolResult,
    chatAdminToolNames,
    chatAdminToolSet,
    chatToolNames,
    chatToolSet,
    filterToolNames
}
