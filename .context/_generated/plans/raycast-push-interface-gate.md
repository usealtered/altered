# Plan: Gate interface navigation before Raycast push

Last updated: 2026-07-15

## Problem

Callers (`global-actions`, command entry) build a `navigationHistory` and mount/`push` `<InterfaceRenderer />` unconditionally. The renderer then discovers a missing/unsupported `INTERFACE_TYPE` and wants to `pop()` — which is the wrong layer and a render-time side-effect hazard.

`resolveNextNavigationPath` already gates path resolvability (`status === "full"`), but does **not** gate “has a mapped React component.”

## Goal

Resolve “is this renderable?” **before** touching the Raycast nav stack. Only `push` when an eligible component exists. Command root uses the same eligibility builder without `push`.

## Design

### Split: pure resolve vs mount vs push

Do **not** put `push` inside `InterfaceRenderer`. Keep the renderer dumb: given a valid history tip, pick a component and render.

Centralize eligibility in a pure helper, then two thin mount adapters:

```
resolveRenderableInterface(navigationHistory)
  → { status: "ready", navigationHistory, thought, attributes, interfaceTypeId }
  | { status: "unavailable", reason, message }

createInterfaceElement(ready)     // shared JSX factory
pushInterface({ push, history })  // resolve → toast on fail | push(element)
```

Command entry uses resolve + `createInterfaceElement` (or inline equivalent). Actions use `pushInterface`.

### Why not “if first history item, don’t push”?

Raycast stack depth ≠ ALTERED path length.

- Command launch always mounts as the **root Raycast view** (no `push`), even when history has two path components (`ACTION_PALETTE` → target).
- In-command navigation always **`push`es** a new Raycast view, even for a one-component placeholder history.

Gate on **call site intent** (`root` vs `push`), not `navigationHistory.length === 1`.

### Eligibility rules (extend existing path resolve)

`resolveRenderableInterface` should:

1. Require non-empty history (invariant).
2. Run `resolveCurrentNavigationInterface` on the tip (reuse today’s path logic).
3. Resolve `INTERFACE_TYPE` via `resolveInterfaceType`.
4. Require `interfaceTypeId in INTERFACE_COMPONENT_MAP` (missing **and** unknown type both fail here).
5. Return `ready` only when all of the above pass.

Partial path resolution: keep today’s soft behavior **inside** the renderer (toast + render truncated tip) **only if** the truncated tip is still type-eligible. If the tip after truncation has no type, treat as `unavailable` and do not push / do not mount a blank root without an error surface.

### Call-site refactor (minimal)

**`global-actions.tsx`**

- Replace both `push(<InterfaceRenderer …>)` branches with `pushInterface({ push, navigationHistory: nextHistory })`.
- Keep `resolveNextNavigationPath` for the non-placeholder branch (path child validity). Optionally fold type-eligibility into that helper later; for the minimal chunk, type check lives in `resolveRenderableInterface` so placeholder + normal paths share one gate.
- On `unavailable`: toast (existing “No Interface Found” / new “Unsupported Interface” message) — never push, never pop.

**`implementation.tsx` (command root)**

- Build history as today.
- `resolveRenderableInterface(history)`.
- On `ready`: `return createInterfaceElement(…)`.
- On `unavailable`: return a tiny markdown/Detail error view (or toast + empty Detail). Do **not** invent a fake push/pop. Root has nowhere meaningful to pop to inside the command.

**`InterfaceRenderer`**

- Remove `pop()` and the missing-type early return.
- Optionally assert `interfaceTypeId` (throw) — data that reaches here should already be gated. Keep partial-path toast only.

### File placement (suggested)

Prefer fine-grained under `renderer/`:

- `renderer/resolve-renderable-interface.ts` — pure resolve
- `renderer/create-interface-element.tsx` — JSX factory
- `renderer/push-interface.ts` — thin wrapper needing `push` from `useNavigation()` (must be called from a component/hook context; either accept `push` as arg from caller, or export `usePushInterface()`)

Avoid stuffing this into `InterfaceRenderer` itself.

### Naming

Prefer:

- `resolveRenderableInterface` (pure)
- `createInterfaceElement` (JSX)
- `pushInterface` (stack mutation)

Avoid overloading `renderInterface` for both root return and push — two verbs keep the Raycast mount modes explicit.

## Out of scope (this chunk)

- Deeplink history expansion / `navigationStyle`
- Merging placeholder vs collection path builders further
- Changing prop-drilled history model

## Implementation chunks

1. **Pure gate + factory** — `resolveRenderableInterface` + `createInterfaceElement`; no call-site wiring yet.
2. **Wire push + root** — `pushInterface` in global-actions; command uses factory; strip pop from renderer.
3. **`pnpm check`** — types/lint/format.

## Acceptance

- Navigating to a thought with no / unknown `INTERFACE_TYPE` never pushes a Raycast view.
- Command launch to an unrenderable tip shows an error surface, not a blank/`null` frame + pop.
- Successful paths behave identically to today (history still prop-drilled per pushed view).
- `InterfaceRenderer` no longer calls `pop`.
