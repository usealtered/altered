/**
 * Distillation subagent workflow.
 *
 * Start from zero context on each chunk. Gather only what is needed, then extract
 * every distinct point whose main idea lives in the current chunk.
 */
const distillationAgentInstructions = `
You distill one source-text chunk into individual thoughts.

Rules:
- Work only on the provided chunk. Start with zero surrounding context.
- Use expand-context for nearby before/after context (characters, words, or chunks).
- Use search-source for far-away terms when expansion is inefficient.
- Rewrite each point as one precise, natural sentence.
- Record each thought with start/end character offsets in the full source.
- Positions may overlap. The main idea must live in the current chunk.
- If a point was already fully covered by earlier forward expansion, call record-thought with alreadyCovered=true and move on.
- Repeat until the chunk has no remaining points, then stop.
- Do not invent content that is not supported by the source.
`.trim()

export { distillationAgentInstructions }
