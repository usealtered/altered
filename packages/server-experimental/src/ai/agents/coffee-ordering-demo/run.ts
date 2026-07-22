import { coffeeOrderingDemoAgent } from "./definition"
import { filterCoffeeOrderingDemoToolNames } from "./tools/set"

async function runCoffeeOrderingDemoAgent({
    message
}: {
    message: string
}): Promise<{
    status: "ordered" | "skipped" | "failed"

    text: string
    steps: Awaited<ReturnType<typeof coffeeOrderingDemoAgent.generate>>["steps"]
    messages: Awaited<
        ReturnType<typeof coffeeOrderingDemoAgent.generate>
    >["response"]["messages"]
}> {
    const {
        text,
        steps,
        response: { messages }
    } = await coffeeOrderingDemoAgent.generate({
        prompt: `Message: ${JSON.stringify(message)}`,

        options: {
            userId: "123",
            accountType: "free",
            complexity: "low",

            memoryDepth: 10
        }
    })

    const partialResult = { text, steps, messages }

    const usedToolNames = steps
        .flatMap(step => step.toolCalls.map(toolCall => toolCall.toolName))
        .filter(filterCoffeeOrderingDemoToolNames)

    if (usedToolNames.includes("order-coffee"))
        return {
            ...partialResult,

            status: "ordered"
        }

    if (usedToolNames.includes("skip-ordering-coffee"))
        return {
            ...partialResult,

            status: "skipped"
        }

    return {
        ...partialResult,

        status: "failed"
    }
}

export { runCoffeeOrderingDemoAgent }
