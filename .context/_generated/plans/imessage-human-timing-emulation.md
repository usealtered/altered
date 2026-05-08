---
name: iMessage human timing emulation
overview: Human-like pacing, segmented bubbles, and scheduling for Sendblue-backed iMessage POC; complements routing/deployment before solidification passes.
isProject: false
---

## Purpose

Raise iMessage POC realism by **staging read receipts, pre-typing dwell, typing durations, gaps between bubbles**, and optionally **restart-typing quirks**, while keeping **few LLM calls** (typically one synthesis + one schedule/metadata pass).

**Adjacent plans:**

- [.context/_generated/plans/imessage-server-poc.md](./imessage-server-poc.md) — vertical scope and infra.
- [.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md](./chat-sdk-history-sendblue-adapter-resolution.md) — owned history, adapters, webhook posture.
- [.context/_generated/plans/monorepo-architecture.md](./monorepo-architecture.md) — package layering.

## Phasing (locked intent)

1. **Now (POC solidification, after prod→dev routing):** **multi-bubble send** with simple delimiters or segments; **no full timing engine** required.
2. **Later:** full **wall-clock-anchored scheduler** (pre-type dwell, variable typing length, inter-bubble delays, optional “stop typing” when Linq supports it).

## Reference example (compressed)

| Event | Time | Note |
| --- | --- | --- |
| User sends long text | T+0.0s | Client clock |
| Webhook hits server | T+4.0s | Natural delay |
| Read receipt | T+5.0s | Already slightly after receive (webhook skew) |
| Pre-read / “thinking” dwell | T+5.0s → T+12.0s | Long inbound → ~5–8s read simulation; short → ~2–4s |
| Start typing | T+12.0s | After max(dwell_elapsed, LLM_ready) |
| Typing duration | T+12.0s → T+15.0s | Scaled to planned reply length |
| Bubble 1 sent | T+15.0s | |
| Pause before next typing | T+15.0s → T+16.5s | ~1.5s default |
| Typing + bubble 2 | … | Repeat until segments drained |

**Design rule:** anchor scheduling to **receive time** (webhook `Date` / payload timestamp when trustworthy), not user device time, so delays stay consistent under lag.

## Multi-bubble content strategy

**Preferred for cost/latency:** one **primary generation** that returns:

- ordered **segment strings** (bubbles), and
- **timing hints** per segment (pre-type delay, typing ms, post-bubble gap), plus optional **global pre-read delay**.

**Alternatives (trade-offs):**

| Approach | Pros | Cons |
| --- | --- | --- |
| Delimited plain text + split | Simple, model-friendly | Need strict delimiter grammar; repair if violated |
| JSON / schema-constrained output | Parseable schedules | More prompt discipline; still one call |
| Tool calls for segments | Structured | Often weaker conversational tone vs pure chat completion |
| One LLM call per bubble | Flexible | Slow, costly, coherence drift |

Default recommendation: **plain completion + delimiter protocol** OR **structured JSON segments** produced in the same call that finalizes wording; encode timings alongside segments.

## ModelMessage persistence

Outbound may be **one logical turn split into many iMessage bubbles**:

- Persist **canonical assistant content** aligned with **`ModelMessage["content"]`** (split into multiple persisted rows **or** one row with multimodal/part content—pick one canonical strategy and keep bubble send as projection).
- **Post-hoc text split → multiple `assistant` rows** is acceptable if each bubble maps cleanly to chronological `created_at` (see below).

## Synthetic `created_at` (optional, advanced)

**Idea:** set DB `created_at` to **planned bubble send timestamp** so analytics/history resemble human pacing.

**Trade-offs:**

- ✅ Better forensics/debug of pacing.
- ⚠️ Complicates sorting vs true insert order; reconcile with ingestion timestamps if needed (`received_at` column may be preferable later).

Defer until timing engine ships; document when chosen.

## Typing limitations (Sendblue vs Linq)

- **Sendblue:** no **stop-typing** signal today; “type → stop → type” quirk is **future-only** (Linq or API upgrade).
- Until then, emulate pauses with **delays between `startTyping` / `post` sequences** only.

## Failure and safety (related routing work)

When **prod→dev tunnel forward** is implemented:

- If tunnel **unreachable**, respond with **`200`** and body **`OK`** (match `SendblueAdapter.handleWebhook` successes in `chat-adapter-sendblue`) and perform **no ingestion** and **no outbound** (explicit “do nothing else” policy unless product later adds a separate admin notice path).

- **Identity gate:** only **admin E.164** (`SHARED_ADMIN_PHONE_NUMBER`, non-empty after normalization) may trigger `/dev` forward; compare **normalized** numbers.

## Inspiration

Local reference prototype: `/Users/inducingchaos/Workspace/containers/imessage-apple-notes-demo/` (multi-bubble nuance and pacing ideas—do not copy blindly; align with ALTERED packages and owned history).

## Out of scope (this document)

- Full EffectScheduler migration (retries/timing orchestration may later use Effect; estimate separately).
- Message-id dedupe (tracked elsewhere; queue item).
