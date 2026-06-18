import type { Tool, TypedToolCall, TypedToolResult } from "ai"
import { createMockQueryMemoryTool } from "./mock-query-memory"
import { createOrderCoffeeTool } from "./order-coffee"
import { createResearchCoffeeOptionsTool } from "./research-coffee-options"
import { skipOrderingCoffeeTool } from "./skip-ordering-coffee"

const coffeeOrderingDemoToolNames = [
    "query-memory",

    "research-coffee-options",
    "order-coffee",
    "skip-ordering-coffee"
] as const

type CoffeeOrderingDemoToolName = (typeof coffeeOrderingDemoToolNames)[number]

/**
 * Narrow the types of tool names to the types included in the tool set.
 *
 * @remarks We may need to prepend `tool-` to the tool call names.
 */
function filterCoffeeOrderingDemoToolNames(
    name: string
): name is CoffeeOrderingDemoToolName {
    return coffeeOrderingDemoToolNames.includes(
        name as CoffeeOrderingDemoToolName
    )
}

const coffeeOrderingDemoToolSet = {
    "query-memory": createMockQueryMemoryTool({
        include: {
            brains: {
                user: true,
                system: true
            }
        }
    }),

    "research-coffee-options": createResearchCoffeeOptionsTool(),
    "order-coffee": createOrderCoffeeTool(),
    "skip-ordering-coffee": skipOrderingCoffeeTool
} satisfies Record<CoffeeOrderingDemoToolName, Tool>

type CoffeeOrderingDemoToolCall = TypedToolCall<
    typeof coffeeOrderingDemoToolSet
>

type CoffeeOrderingDemoToolResult = TypedToolResult<
    typeof coffeeOrderingDemoToolSet
>

export {
    type CoffeeOrderingDemoToolCall,
    type CoffeeOrderingDemoToolName,
    type CoffeeOrderingDemoToolResult,
    type coffeeOrderingDemoToolNames,
    coffeeOrderingDemoToolSet,
    filterCoffeeOrderingDemoToolNames
}
