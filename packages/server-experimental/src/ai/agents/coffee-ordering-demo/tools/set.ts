import type { Tool, TypedToolCall, TypedToolResult } from "ai"
import { createOrderCoffeeTool } from "./order-coffee"
import { researchCoffeeOptionsTool } from "./research-coffee-options"

/**
 * @todo P2: This could probably be the source of the tool set keys.
 */
const coffeeOrderingDemoToolNames = [
    "research-coffee-options",
    "order-coffee",
    "skip-ordering-coffee"
] as const

type CoffeeOrderingDemoToolName = (typeof coffeeOrderingDemoToolNames)[number]

/**
 * @remarks We may need to prepend `tool-` to the tool call names.
 */
function filterCoffeeOrderingDemoToolNames(
    name: string
): name is CoffeeOrderingDemoToolName {
    return coffeeOrderingDemoToolNames.includes(
        name as CoffeeOrderingDemoToolName
    )
}

// very useful example for our keyword indexing synonymous expansion revision:  https://ai-sdk.dev/docs/agents/workflows#evaluator-optimizer

//

const coffeeOrderingDemoToolSet = {
    "research-coffee-options": researchCoffeeOptionsTool,
    "order-coffee": createOrderCoffeeTool({ memoryDepth: 10 }),
    "skip-ordering-coffee": createOrderCoffeeTool({ memoryDepth: 10 })
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
