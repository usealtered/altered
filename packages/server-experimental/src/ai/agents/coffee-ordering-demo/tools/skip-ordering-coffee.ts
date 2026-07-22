import { tool } from "ai"
import { type } from "arktype"

// combine with `toolChoice: 'required'` for tool-only outputs: https://ai-sdk.dev/docs/agents/loop-control#forced-tool-calling
const skipOrderingCoffeeTool = tool({
    description: "Signal that you have finished your work",
    inputSchema: type({
        answer: type("string").describe("The final answer")
    })

    // No execute function - stops the agent when called
})

export { skipOrderingCoffeeTool }
