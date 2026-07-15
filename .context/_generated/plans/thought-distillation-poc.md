# Thought Distillation — Master Plan (POC v1)

Status: **approved direction, ready for implementation**.

Companion plan: `memory-query-poc.md` — separate but co-dependent. This plan owns the shared schema (thoughts, datasets, attributes, tags, agent_runs) and the shared keyword-generation codepath; the query plan consumes both.

Grounding sources (for future context loading): Apple Notes 2026-06-22 ("Distill Thoughts tool" + "Memory Injection Placement & Agent Authority"), 2026-06-28 ("Something else about the distillation process" — subjective content handling), 2026-06-17 (summarized indices — deferred), 2026-05-30 (keyword expansion strategy), 2026-05-13 (original query/distill algorithm sketch); Koa chat 2026-06-23 (script-first execution directive) and 2026-06-29; planning chat 2026-07-05 → 2026-07-15.

---

## 1. Objective

Auto-transform source text into individual, AI-authored, keyword-indexed thoughts — backlinked to immutable sources — so the user gets a ~90% accurate, usable ALTERED brain with **zero manual work**. The end goal (ultimate control of your psychic entropy) is for the user to manually review every derived thought and its source, rework it to their liking, and validate/approve it — the most strenuous task in ALTERED. Until they do that for everything, the auto-distilled brain is the usable 90% baseline. This phase builds only the auto path.

How this appears in the app: the auto-distillation process splits a raw thought (a Cursor chat imported as source, a long voice note, a chat message) into many individual, AI-authored (attributed/labelled), indexed thoughts carrying both user-land **Datasets** and system-generated **tags**.

Corpus order:

1. **Koa iMessage `chat_messages`** (100+ rows, includes very long messages) — the tuning corpus. Fine-tune the whole process here until ~80% satisfactory.
2. **Apple Notes markdown exports** — bulk upload near the end of the POC via a minimalist utility (section 8).
3. **Cursor chats** — explicitly out of scope; different beast, handled by a future Search Files flow (section 10).

## 2. Timebox & posture

3–7 days alongside the 9–5. Governing mindset: any sub-problem that could eat days of validation (e.g., the history exclusion window) ships as its simplest form — a one-to-five-line check — with the full design preserved as a `@todo`. Everything non-critical is reduced and minimized. No compromise on the quality of what does ship: every line is human-reviewed; the product is a representation of real quality. Cost metrics are an accessory, not a main actor — but still 100% necessary.

## 3. Success criteria

- **Primary (v1):** manual review of results at each stage of the process — positional references, sentence conciseness and clarity, keyword sanity — confirming it is done to the standard of how Riley would do it by hand on paper.
- **Deferred (laborious, later):** a benchmark base — hand-distill the first ~20 chat conversation messages ourselves, then diff programmatic output against the human base and work backward from mismatches.

## 4. Conceptual model: raw thoughts and source text

This section records the conceptual decision behind source storage; it drives the schema.

- Imported source text (Apple Notes, voice-note transcripts, pasted chunks) is **not a file**. Whether extracted from Notion or imported raw, its intrinsic type is a large, long chunk of ideas — a **"raw" thought**: straight out of the brain, raw entropy, where every thought starts as text. It is stored **as a thought**, in the thought content field, with a special grade/type/state.
- Raw thoughts are **not meant to be edited/updated**, and are ultimately **temporary**: they exist to be broken down, are extensively supported (indexed, backlinked) until deleted, and deletion happens when all thoughts have been manually resolved from the source text and the user approves deletion.
- Rationale: the "ideal" brain contains only maintained (organized/refined-toward-perfection) thought structures and associated files; anything outside that should be removable (with exceptions like version history, itself periodically prunable unless explicitly kept).
- The grade may be a column on the thoughts table or a reserved system attribute relation — column for now. This forces a future rethink of what "draft" means (currently: a thought missing alias and/or content) alongside validated/invalidated, and where each concept lands in code. **That rethink is explicitly deferred — not worth stressing over now.**
- **Chat messages are the exception:** to avoid duplication they are NOT copied into raw thoughts. They are referenced polymorphically as source (section 5) and resolved through an app-level adapter.

## 5. Data model

Fresh and minimal, design cues from `altered-again` (`thoughts`, `datasets`, `brains`, `thought_metadata` tables) but without the deprecated `kind` discriminator baggage. The Thought data model and its variations get brought over **reconsidered** under the raw-thought concept above.

File placement: `src/models/<entity>/storage/schema.ts` style inside `@altered/server-experimental`. Do **not** group tables under `storage/database/memory/` — in the storage folder, "database" contains per-table folders or non-table database code, and many tables (e.g., messages) already live under their own topic folders. The overall file structure is still a work in progress; keep entities separable. Extend the **current Neon database/schema** — no separate namespace.

### Tables

- **thoughts**
  - `id` — nanoid (default alphabet, 21 chars).
  - `brainId` — nullable until auth lands. One brain per phone number conceptually. No separate system brain — a flag column instead. Note: brainId will eventually shift to a dynamic dataset relation and this column may disappear; keep it for now, migrate later.
  - `alias` — nullable. Alias-less thoughts allowed initially; an alias-generation pass can come later.
  - `content` — the thought text (also holds full source text for raw thoughts).
  - grade/type column — discriminates `raw` vs derived/manual (naming provisional; see section 4 deferral).
  - AI-authorship attribution flag — derived thoughts need labelling as AI-authored.
  - system flag column — replaces a separate system brain.
  - `createdAt` / `updatedAt`, plus original created/modified timestamps for imported sources.
- **datasets** + **thoughts_to_datasets** — user-land structures, represented per the product model (datasets are themselves thought-like tags).
  - One **reserved system dataset `derived`**. Every derived thought receives it. The dataset assignment *is* the source-link contract: **removing the dataset removes the link to the source and all associated attributes.**
  - Attribute-schema association is **name-based only** for now — no literal schema enforcement. Conceptually: the dataset has N associated attribute IDs; a thought holding the dataset without those attributes is invalid / a "draft" (term to be renamed if unfit). Enforcement comes later.
- **attributes** — stub of the future scalable-thought-columns table. Backlinks are stored **here, not in a dedicated backlinks table**:
  - `source` — polymorphic reference: type + id (e.g., `chat-message` | `thought`), validated at the application level. A `type=reference, value=...` column setup or a serialized object is acceptable — optimize when implementing.
  - `source-start-position` / `source-end-position` — numbers; if line+char coordinates are needed, a serialized object is fine for now.
  - Frontends can render the source ID however they like and use it to look up the raw thought / chat message.
- **tags** — the keyword table, associated to thoughts. Thought-scoped, never source-scoped (rationale in section 7).
- **agent_runs** — one shared table for BOTH distillation and query runs. Naming rationale: "runs" alone is ambiguous; "agent_runs" clearly means AI-agent executions, storing statistics/metrics about generations, not the generations themselves. Fields: type discriminator, model, token/cost stats, status, timestamps, and relations to whatever the cost is associated with (conversation, thought, source) — polymorphic column or multi-column relations, whichever is simplest; app-level relation discernment is fine. Requirements: duplicated re-distill outputs tie to a run id so they can be filtered, reviewed/compared, and deleted; batched runs (reindex) must be distinguishable from single-message runs.

### Source-change propagation

Derived thoughts are a special type that is **immutable** — they can only be deleted, and deleting unlinks everything. Since raw sources are also not meant to change, the "what happens to derived thoughts when the raw thought changes" problem is dissolved by construction. Re-distillation (section 7) covers regeneration needs.

## 6. Distillation algorithm ("human on a piece of paper")

The design question throughout: how would a human do this by hand? The v1 skeleton from earlier drafts was slightly overblown for POC but right-shaped for a durable algorithm; this is the corrected version.

### 6.1 Chunking

- Split the source into **sentences** (if properly splittable); fallback to a character/word cutoff at average sentence length when sentence splitting fails.
- Chunks are processed **sequentially** — that's how humans read. (An earlier idea was parallel async background jobs per chunk; explicitly rejected for source-text chunks.)

### 6.2 Per-chunk agent loop

Runs in the **distillation subagent** (`ai/agents/chat/subagents/distillation/`), never the main chat agent. Rationale (2026-06-22 note): instructions mostly differ, and context must NOT be the whole chat — each chunk starts from **absolutely zero context**, then expands only with what the loop gathers.

1. **Gather context.** The agent must understand the target text before working with it.
   - Primary tool: **directional expansion** — request ± X characters, words, or sentence-chunks before/after the target. Navigating directionally to search for surrounding context is the most accurate, context-efficient strategy compared to summarizing or AI-searching the entire source text.
   - Alternate tool: **programmatic text search within the source** for a set of words that may sit in far-away chunks — more efficient than repeated chunk expansion, especially when the context isn't expected to be nearby.
   - Deferred, noted for later: (a) final-resort full-source load into context; (b) if subtext meaning still can't be inferred, chronological search of external thoughts created before/after the source; (c) if the agent knows what the subtext means but needs external ideas (e.g., how ALTERED's distillation works — the business concept, not the capitalized word), allow it to query the thought database.
2. **Rewrite.** Using all gathered context, write the most precise yet natural definition of the **first point/concept in the chunk**. Future: stylized to the user's preferences or trained style. This is the extracted thought content.
3. **Positional reference.** With the same context group, decide what positional span best represents the thought — directly or indirectly — within the source. This position **may overlap** other extractions; that's fine. Refs may extend into before/after chunks **only known ones** (expanded/adjacent), never far-away searched chunks across an unknown gap — and only as long as the main point of the target idea lives in the current chunk.
4. **More points?** With the same context (now including the derived thought), decide whether the original chunk contains additional points to distill. If yes, repeat steps 2–3 **within the same agent**, retaining all previous context — for points within the same sentence/chunk it will almost always be useful. Repeat until the chunk is deemed complete.
5. **Advance.** Move to the next chunk and **drop context to zero** by default. Exceptions and mitigations:
   - If the previous chunk was a length-based cutoff (not a real sentence), a core concept may straddle the boundary. Implicit/indirect statements ("Yeah, I want that.") also require before/after knowledge. This is very subjective — **marked for a later strategy discussion with AI**.
   - Mitigation: an **offered (not auto-called)** tool that retrieves the derived thought(s) from the previous chunk — or ahead chunks — with their positional references. Since both chunks and derived thoughts carry positional references, the association is implicit. This takes precedence over raw before/after chunk traversal.
   - **The step-5 catch:** if the first concept in the current chunk was already fully distilled by the previous chunk's forward expansion (it got "after" context and derived the thought), the agent must **explicitly call this out** — via a status-update tool call, completion-milestone tool call, or similar — stating the first target (or several following targets, if multiple were already 100% distilled in prior known context) is done, then move on.

Step 5 repeats until derived thoughts cover the entirety of the source text.

### 6.3 Keyword indexing

Foundational principle (settled after deliberation): **keywords are explicitly about the derived thought row itself.** Surrounding source context would be unknown pollution — the thought detaches from its source over time — even though it would help indexing relevance. Keywords exist for **searchability/findability beyond datasets**; they are NOT for structure or relations — datasets do linking, structuring, and topical association. Keywords must not rely on the source text.

Timing: either simultaneously during each chunk (leverages in-memory context) or afterwards per derived thought as an independent job. **Default: independent job per thought**; per-chunk inlining is a later option.

Steps:

0. **Pre-generation context:** a limited search using the **query tool** (Plan B) to gather brain-side info about the thought being indexed — run in a **subagent**, with results **summarized** before loading back to reduce context. Critical constraint: generated keywords must relate **only to the thought, NOT the summary** — double down on this in the relevance pass. (External searching here can resolve things like "ALTERED" as a business rather than a capitalized word.) Stub this step until Plan B lands.
1. **Direct keyword generation** for the thought.
2. **Synonym expansion** — the existing `expandKeywordGeneration.iterations` option, default 1 iteration. (Per the 2026-05-30 note: expansion ~10x's surface area; a second expansion introduces drift — don't.)
3. **Relevance strip** — drop expanded keywords without direct relevance to the thought (the classic "pets → pet food" drift example). This keeps indexing surface area high without introducing irrelevant retrieval.

The keyword strategy stays **basic** for now — no added nuance unless a need emerges. The generation codepath is **shared with query-side keyword inference** (symmetry; divergences documented in `memory-query-poc.md`).

Notes:

- Surrounding brain context will change and evolve as thoughts accumulate — we can always **re-index**, and even **re-distill** (helpful for really vague source text needing more context), though re-distilling will be rare. Noted, not built.
- `@todo` P3: optimize keyword accuracy by factoring in / comparing against global keyword rankings (Google keywords or a dictionary tool).

### 6.4 Auto-dataset creation & assignment (future — recorded, not built)

Separate from distillation and indexing. AI-authored dataset creation/assignment, driven by **different factors than keywords**: sibling/very-similar thoughts found via cross-keyword searches, and/or existing applicable datasets. These factors assign existing datasets or **conservatively** design new ones to group/structure thoughts desirably. Possibly extended to require an actual **intent**: why group marketing ideas you'll never use? Why file a Makeup thought into a Cosmetics dataset if you're a guy? Intent-discovery could be part of generation — generate grouping ideas, then search the brain for a usage intent; without one, the grouping is by definition pointless. Useful later depending on how datasets serve structure/relations in ways keywords can't; not needed immediately.

## 7. Integration & runtime behavior

### Trigger

- Distill **every saved message**: user messages, assistant messages, perceived commands, short and long alike. Rationale: everything in the conversation is a fact we consumed and accepted as truth or rebutted, and memorized — the memory layer should mirror that. Assistant messages matter so we remember what the assistant generates.
- **Async background job** (leaning). Trade-off recorded: async lets the chat agent instance continue quicker, but a slow distillation could be missed by an immediately-following query — mitigated by the retained-history rule ("keep X messages/X duration back, omit those sources from the query, and query distilled thoughts only for prior messages"), which gives the job more than enough runway. Sync remains acceptable if simpler to ship first.

### Failure handling

Async delegation means we always still respond. Worst case for an unhandled failed job: the message eventually exits the exclusion window with no distilled thoughts — a context gap, acceptable for POC. Add retry logic only if trivial; otherwise let it fail, spot it in logs, and re-trigger by run id via a pnpm command later.

### Tool output

Less is more for returned context. The earlier `thoughtCount`/`cost` output schema was placeholder; v1 returns essentially **`success` boolean + a message**. Thought payloads are never returned through the tool — they're loaded independently via querying. Stats are derivable from `agent_runs`.

### Idempotency & re-distillation

- All-new inputs → proceed.
- Any already-distilled inputs → when run from a UI (Raycast), return a **confirmation prompt** first.
- Overwrite vs duplicate is an open question. **For prototyping: duplicate**, with every output tied to its run id so runs can be filtered, compared, and bulk-deleted. Refine later; the only hard requirement is that batched (reindex) runs stay distinguishable.

### Message persistence refactor (prerequisite/parallel work)

Full reasoning recorded because it changes the chat data model:

- **Reasoning tokens:** everything excessively reasoned before a conclusion is unrefined entropy; the response is that thinking's most concise form, ± tiny context loss. The purpose of thinking is to derive the conclusion, not to remember everything thought — so **do not store reasoning tokens or any intermediary tokens**. If "why we concluded X" ever matters, that's an external optimization (e.g., a tool call that saves in-depth reasons) layered on later.
- **Tool calls/results:** during the run the agent sees them live; once persisted they're conversational noise. Query results, distilled-thought counts, etc. are always derivable as statistics from the DB primitives themselves. **Strip all tool calls and tool results before saving.**
- **What survives:** only the meaningful text messages actually sent — status updates ("thinking…", "found X, digging further…") and the final response — saved as **separate message rows**, one plain-text content each (the jsonb column stays but holds plain text per row). Semantically separate entries beat a multi-part JSON blob, even if that departs from the OpenAI message spec — the stripping already does. Philosophy: the DB should best represent the iMessage conversation (which also serves the multi-bubble/timing plans), not the source generation — full traces are always retrievable from OpenRouter (generation IDs) on the developer side, and could be exposed to users much later.
- Accepted caveat (evaluated, no strong counter-argument found): losing tool records means no mid-loop resume from DB and no strict provider-format replay — neither is needed, since context is rebuilt from text rows every turn.

### Reindex conversation

A **pnpm script**, not an agent tool (an agent-tool variant can come later). One argument: `skip` (messages already distilled) | `overwrite` | `duplicate`. Required because starting fresh from incoming messages only would miss the 100+ existing messages — we must be able to trigger an index of the entire thread.

### Scratchpad implementation file

`scripts/tmp-distill-poc.ts` — the entire pipeline in one file (importing agents etc., recreating within the file rather than pre-integrating), to avoid the time overhead of refining into infra prematurely. Constraints: it is **DB-backed and online** — maintains the database-based consistent architecture, not an offline/local run — and is a scratchpad to be refactored into infra later. It may persist as the **batch-distill entrypoint**: takes a list of IDs (copied from the database) and batch-distills them. The eventual production trigger path is the incoming Raycast internal-experimental admin extension (file-upload form + an ID-list batch-distill form command); local pnpm-script ingest of notes was explicitly dropped in favor of that, with the interim utility below.

## 8. Apple Notes upload utility (near end of POC)

After the chat-message corpus is tuned to ~80%: a minimalist utility uploading a **nested directory of markdown files** → raw thoughts, storing modified + created dates, original title, content, potentially the file path (value uncertain), and the upload date. Keep file metadata minimal.

`@todo`: dedupe — hash the properties+content, check for the hash before insert, and warn "already uploaded — upload anyway or cancel?". Not a priority; DB-level dedupe (search, compare, delete duplicates) is always possible after the fact.

## 9. Models, cost & observability

- **`anthropic/claude-sonnet-4.6` for every step** — model consistency valued over savings at this stage; it's also what the chat runs on. Watch the cost metrics breakdown.
- Build a **per-step model map** (split / rewrite / keywords / relevance / …) with every preset = 4.6, plus `@todo`s marking which steps can drop to smaller models (suggested: `openai/gpt-5.4-nano` — already used for admin command classification — for synonym expansion, relevance strips, and other tasks that don't need extreme context conclusions or intelligence).
- AI SDK notes: the model can be swapped mid-agent (same instructions/context), per tool, and per step — separate agents just configure their own.
- **No cost caps or kill switches** — the OpenRouter dashboard limit governs prototyping.
- Metrics: **new tables** (`agent_runs` + relations), plus console logging. **No user-visible stats** — a dashboard or Raycast command comes much later.

## 10. Deferred / out of scope

- **Cursor chats — future Search Files flow.** Cursor chats are a totally different beast (code content, long contradicting threads where early decisions evolve/expand/contradict/die, massive context). Do NOT index them like notes. Future design (recorded, detail intentionally light): upload chats as files to file storage (blob-style service, e.g. UploadThing-like; probably better than DB text), referenced in a DB table; a **Search Files** tool — possibly its own subagent — greps them (inspiration: Vercel's grep site, grep.app-style) returning only exact matching text content, optionally with a summarization step reducing results to detailed conclusions (like reasoning tokens) before returning to the main chat. Results are stripped from saved history exactly like query results — repeated searches are far cheaper than persisted inference tokens, even re-searching on later turns. A **pnpm parity script** exposes the same search so remote Cursor agent instances can query the cloud-stored chats (note it in AGENTS.md when built). Distillation may consolidate onto Cursor chats much later.
- The subjective-content stance (2026-06-28 note) stands and needs no extra machinery: distill and index **everything**, including vague/contradicting/unsolidified voice-note ramble — resurfacing similar or contradicting thoughts is the point; correction is the human's job in the future clarity system. **No certainty scoring** now — a distilled conclusion is what it is.
- Compression tiers: **single tier** until the POC defines the axes of variability (the low/med/high idea with per-tier examples is recorded in the 2026-05-30 note).
- Hyper-summarized topic indices w/ invalidation hashing (2026-06-17 note), vector store, clarity/merge/archive tooling, auto-datasets (section 6.4), Super Memory shortcut, alias-generation pass, benchmark harness (section 3), draft/validated/raw semantics redesign (section 4), indexing-version persistence & git-artifact re-run strategy (2026-05-30 note).
- **Named next step after both plans are complete and tested to satisfaction:** a structured-thinking prototype — datasets layered onto refactored thoughts to create precise, trackable structures (e.g., the marketing plan) — with an interface to interact with it, likely a Raycast extension. Beneficial during the marketing campaign; can be done manually in notes/a repo in the interim.

## 11. Execution phases

1. **Schema + models** — thoughts, datasets, thoughts_to_datasets, attributes stub, tags, agent_runs, under `src/models/<entity>/storage/`; `pnpm db:push`.
2. **Chunker + context tools** — sentence split with length fallback, directional expansion, in-source text search; pure functions, script-tested in isolation.
3. **Distillation subagent + per-chunk loop** inside `scripts/tmp-distill-poc.ts`; run against real Koa messages; manual review of thoughts + positional refs.
4. **Keyword job** — generate → expand → strip; brain-query context step stubbed until Plan B phase 2; manual review of tags.
5. **Save-path integration** — message-persistence stripping refactor + on-save distill trigger (async job).
6. **Reindex-conversation script** — backfill the full Koa thread; validates batch mode + run distinguishability.
7. **Apple Notes upload utility** + bulk distillation run over the exports.

Dev workflow at every phase: scripts to test individual components → larger manually-triggered runs → only then promote functionality into the main chat agent's tool capabilities.
