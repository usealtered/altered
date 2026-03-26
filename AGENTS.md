# Introduction

Welcome to the ALTERED codebase! We're building the next generation of knowledge infrastructure. Since we are a data-first generalist platform... the foundations really matter. Let's aim for functional perfection.

# \[TEMPORARY\] Codebase Migration

- We are currently working to re-build the ALTERED app from scratch in this repo. For any given implementation, first inspect the project for any relevant patterns (including relevant git branches and stashes) at `/Users/inducingchaos/Workspace/containers/altered/`, and copy the code directly in a way that fits the current objective.

- If you have suggestions for better naming, structuring, or any other sort of improvements over the old codebase, always suggest them before copying the existing patterns.

# Context

- Always read `.context/PRODUCT.md` before starting any work that entails specificity, data models, branding, or any work that is NOT super generic in flavour.

- For up-to-date status on the current implementation, always reference `.context/NOW.md`. This is helpful for persisting context across chats, as well as planning and tracking the current set of changes.

# Workflow

- Never start any long-running processes or persistent tasks (such as a dev server) unless explicitly asked.

- Interact with Git in a read-only way unless the user makes an explicit request.

- Prefer multiple specific, surgical files over a bloated file.

- Generate code in small, manageable chunks of 2-3 main functions, files, or topics at a time - then end your turn so that the code can be manually reviewed and committed.

- The following glob patterns represent the blacklist for modifying files - never touch them without explicit instruction: `.context/**`, `!/.context/generated/**`, `AGENTS.md`.

- When saving a plan to the workspace, do so in `.context/generated/plans`.

- ALWAYS provide a reminder at the end of each code generation turn for the user to review and update the agent context files. Pull all critical points from the latest messages and code changes into a list of suggestions, then provide them to the user within the chat.

# Style

- Make generous use of single line-break gaps between code lines within a block to increase readability. If 2-5 lines are semantically groupable, then it's acceptable to keep them together.

- We should aim for a minimal, yet scalable and functional, perfectionistic codebase. Our architecture and quality should never be sacrificed for the sake of speed, convenience, or otherwise.

- We should aim to cap complexity for cognitive load and maintenance reasons. This extends to advanced types, program composition, and anything else that could be deemed over-engineered or too heavy. As a solution, we can likely achieve the same capability and aesthetic by simply writing a bit more code, or doing it in a different way.

# Conventions

- Always generate an expanded TSDoc block (even if empty) at the top of each file for aesthetic and consistency.

- If a package version is likely to be shared across multiple apps or packages, always define it as a catalog item in the `pnpm-workspace.yaml` file. use `catalog` if the dependency has no obvious topic-based grouping, otherwise use `catalogs` with a minimalistic group name.

- Inline comments should have 2 spaces before the content to aesthetically match indentation, rather than 1 space: `//  <content>`.

- TODOs should follow the format `@todo P<0-3> <description>` for TSDoc, and `TODO P<0-3> <description>` for inline comments.

- Comments should use the `@remarks` flag in TSDoc.

# Technologies

- Use Effect as a first-class TypeScript library for anything it can solve. Use the latest beta release. You can use the "unstable" APIs when necessary with consideration.

- Use Upstash as the go-to for any of their popular services such as Redis, message queuing, etc.

# Documentation

- When using Effect, until v4 is stable, always fetch the migration docs: `https://raw.githubusercontent.com/Effect-TS/effect-smol/refs/heads/main/MIGRATION.md`. Then, if you want info about any non-obvious APIs, fetch `https://effect.website/llms-full.txt`. Lastly, some functions cannot be found in the documentation, so consider searching the source code directly.