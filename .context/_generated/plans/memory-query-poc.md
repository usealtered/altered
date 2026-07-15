# Memory Querying — Master Plan (POC v1)

Status: **approved direction, ready for implementation**.

Companion plan: `thought-distillation-poc.md` — it owns the shared schema (thoughts, tags, attributes, agent_runs) and the shared keyword-generation codepath. This plan consumes distilled data and cannot be meaningfully tested before Plan A phases 1–4 produce real thoughts.

Grounding sources: Apple Notes 2026-05-13 (original query algorithm sketch), 2026-05-30 (keyword expansion + query symmetry), 2026-06-22 ("Memory Injection Placement & Agent Authority" — same-agent decision, memoryQueryId concept), 2026-05-08 (selective chat history direction); planning chat 2026-07-05 → 2026-07-15.

---

## 1. Objective

Given conversation context + optional questions, retrieve **all** relevant distilled thoughts from the database with minimal token load — enabling conversation restarts and shrunken message history without memory loss, and serving as the context engine for the V1 marketing work.

Why confidence is high: querying is much more straightforward than distillation. If the distilled keywords and the queried keywords are both correct, retrieval should approach 100% — the hard problems live on the indexing side.

## 2. Success criteria

- **Primary (v1):** manual review of query results.
- **Later benchmark** (mirrors Plan A's): for ~25 distilled messages, choose a question that well represents a slice of memory, manually select the thoughts we consider associated with it, run the programmatic query, view the diff from the human base, and work backward from the misses.

## 3. Tool contract

The existing `query-memory` tool shape stands (defined in `ai/agents/chat/tools/query-memory.ts`):

- **Input:** `context` — a detailed description of the current conversation topic, scope, and intent; optional `questions[]` about the conversation. Parameter options and style will be tuned iteratively (not too much, not too little) as real usage reveals friction.
- **Output:** thoughts with id, content, alias, timestamps, and datasets. Per Plan A's persistence rules, this tool result is consumed live in the agent loop and **stripped before the assistant message is saved** — statistics are derivable from `agent_runs` and the DB primitives.
- The `include.brains.{user,system}` options concept survives as filters over the thoughts table's system flag column (no separate system brain — one brain per phone number, flag-discriminated).

## 4. Query pipeline

### 4.1 Keyword inference

- Runs as a **separate agent job with limited context** — not inline in the main chat agent's generation. Input: the tool's `context` + `questions`.
- **Codepath symmetry with indexing:** query-side keyword generation shares the module Plan A builds (direct generation → synonym expansion). Symmetry between how thoughts were indexed and how queries are formed is what makes keyword retrieval near-lossless.
- **The one deliberate divergence:** query keywords are **NOT relevance-limited to the input search string**. A search string implicitly assumes related knowledge about the entire brain — stripping "low-relevance" query keywords would amputate exactly the associative reach a search needs. So: no input-keyword relevance strip. The relevance pass moves downstream, onto the **resulting output thoughts** (4.3). Different, but similar — fill in implementation blanks from this principle.

### 4.2 Candidate retrieval

- SQL: tags join → distinct thoughts (with datasets relation loaded for the output shape).
- **Include all auto-thoughts** — alias-less, unvalidated, everything. Stub props for future preference filters (drafts / validated / approved / AI-suggested inclusion flags) with `@todo`s to consider adding them; excluding via null alias is trivial whenever wanted. The full query-flag matrix (draft/validated/approved differentiation, per-consumer hardcoding with user-forwarded toggles) is a recorded future concept, not POC.
- **Datasets are excluded from auto-querying** — auto mode operates on tags; datasets stay user-land (per the settled keyword-vs-dataset division in Plan A section 6.3). No dataset IDs in the tool input for now.
- **History exclusion:** thoughts whose source is a chat message inside the retained-history window (section 5) are excluded — never re-load into memory what's already sitting in conversation context. This same rule is what makes async distillation safe (the job has the whole window's lifetime to finish before its output becomes queryable).

### 4.3 Relevance pass

A subagent (cheap-model `@todo`; Sonnet 4.6 for now) reviews the retrieved thoughts against the query context and drops the remotely-irrelevant. Expected to save 50%+ of returned context and improve answer accuracy. This is the relocated relevance filter from the indexing pipeline (see 4.1 divergence).

### 4.4 Return

- Return **whole thoughts** — correctly distilled thoughts are ~one sentence, so per-thought excerpting/omission (an earlier idea) is unnecessary overhead. Revisit only if thought lengths balloon.
- **No result-count cap and no token budget.** Instead, a rudimentary safety: token-count the result set and emit a console warning if it exceeds ~50% of the model's input limit (we have per-model token-limit metadata). Purpose: identify the problem when it becomes real and shift priority to it then — not engineer for it now.

### 4.5 Persistence & metrics

- Every query writes an **`agent_runs`** row (shared table with distillation; type discriminator = query) with model, token/cost stats, and relations to the conversation.
- The run id doubles as the **memoryQueryId** concept (2026-06-22 note): a lookup key for all thoughts returned by a run, enabling future omission of already-loaded memories from subsequent calls in the same conversation. Record the returned thought ids against the run; the omission behavior itself is a `@todo`.

## 5. History exclusion window

**v1 POC: a simple minimum token count.** Walk messages backward from most recent, accumulating until ≥ ~512 tokens; that set is the "retained history," and its distilled thoughts are excluded from query results. This should be a one-to-five-line check — ship it and move on.

`@todo` P2 — the full ergonomic formula (designed, recorded, deliberately not built):

- **Message minimum:** at least 1 user + 1 assistant message; possibly minimum 3 total so the shape is user-assistant-user (something to play with).
- **Role-block expansion:** when the boundary lands mid-block, expand to capture the full block of same-role messages at the old end. Worked example — sequence A (most recent): user, B: user, C: assistant, D: assistant, E: user → after A+B+C we have 1 user + 1 assistant, but C sits in an assistant block, so include D; stop; E excluded.
- **Token minimum:** 256–512 (probably 512). Combined procedure: fetch the last ~5–25 messages, ensure the set crosses the token threshold (re-query if not), token-count each, find the message count where the threshold is just crossed, verify the role minimums, then expand to complete the role block at the old end.
- **Time floor:** always include all messages from the last 30–60 minutes, expanded to whole role blocks.
- **Max cap:** ~16,384 tokens (long voice-type inputs), hard to hit under these rules; on exceed, just `console.warn` for now.
- Possibly unify count/tokens/time into one formula eventually.

## 6. Agent integration

- The forced first tool call stays: `prepareStep` step 0 restricts to `query-memory` with forced tool choice (already in `ai/agents/chat/definition.ts`), and the workflow instructions keep the loop — query at least once, re-query if the results reveal areas to expand, repeat until satisfied.
- **The main chat agent decides when it's satisfied.** One question can turn into multiple questions/queries — that's fine. **No maximum query calls per turn** and no artificial caps anywhere: the infinite-loop probability is low, the OpenRouter account cost limit is the prototyping backstop, and the existing 25-step `stopWhen` remains the only structural bound.
- Same-agent memory decision (2026-06-22 note, reaffirmed): the chat agent itself calls the tool — no split-brain pre-injection agent — with results stripped from persisted history. Deferred alternative (ephemeral system-message injection by a separate agent) stays deferred.
- **Cross-plan dependency:** the distillation keyword step (Plan A section 6.3 step 0) calls this query pipeline inside a subagent with summarized results. Plan A stubs it; unstub when this plan's phases 1–3 land.
- **Developer/API surface:** the core query function must be callable outside the agent (scripts first, and later Cursor-side marketing work pulling from the DB) — same pipeline, no tool wrapper.

## 7. Models, cost & observability

- **`anthropic/claude-sonnet-4.6` for every step** (keyword inference, relevance pass) via the shared per-step model map; `@todo` downgrades for the mechanical steps (suggested `openai/gpt-5.4-nano` for relevance filtering and expansion).
- No cost caps; log metrics + store in `agent_runs`; **no user-visible stats** (dashboard/Raycast much later).

## 8. Deferred

- Preference filter matrix (drafts/validated/approved/AI-suggested) beyond stubbed props.
- Dataset-edge traversal, multi-dataset narrowing-vs-broadening semantics.
- Vector store — only if keyword miss rates prove unacceptable; keyword symmetry is expected to suffice, and vectors are a split-brain.
- Hyper-summarized topic indices with presence-diffing and change-hash invalidation (2026-06-17 note) — a later distillation advancement.
- Per-thought excerpting/compression of results.
- **Selective chat history** — replacing full-history loading with query-backed context + the exclusion window (2026-05-08 note). The natural follow-on once this plan proves retrieval; not part of it.
- Result caching (mostly query-string-keyed, so hit rates would be poor — recorded thought from 2026-05-13, not pursued).
- User-visible observability.

## 9. Execution phases

1. **Retrieval SQL** — tags → thoughts joins + the v1 exclusion window; script-tested against distilled Koa data from Plan A.
2. **Keyword inference job** — shared generate+expand module from Plan A, skipping the input relevance strip.
3. **Relevance-pass subagent** over result thoughts.
4. **Token warning + `agent_runs` logging** (memoryQueryId groundwork: store returned thought ids per run).
5. **Replace the `query-memory` placeholder**; unstub Plan A's keyword-context query step; verify via `scripts/run-agent.ts`, then iMessage E2E.

Dev workflow mirrors Plan A: individual components via scripts → larger manual runs → promotion into the chat agent.
