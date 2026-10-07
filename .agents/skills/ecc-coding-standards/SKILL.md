---
name: ecc-coding-standards
description: Review or refactor EduStart HTML, CSS, browser JavaScript, and Node.js tools for readable names, focused functions, clear errors, and maintainability using ECC conventions.
---

# ECC coding standards for EduStart

Read the repository's `AGENTS.md` and current `HANDOFF.md` before changing code.

## Review a change

1. Identify the requested behavior and the smallest files that implement it.
2. Use descriptive names, simple control flow, early returns, and explicit error handling.
3. Preserve the site's dependency-free HTML/CSS/JavaScript architecture and UZ/RU/EN parity.
4. Prefer immutable values when practical; deliberate local mutation is acceptable when clearer.
5. Treat React, TypeScript, backend, and database examples as conditional references. Do not add a framework, build step, package manager, or dependency to satisfy an example.
6. Keep QA reports honest: source checks do not establish browser behavior or visual acceptance.
7. Review the changed files, run the applicable checks listed in `AGENTS.md`, and report remaining failures.

Read [the pinned ECC source](references/upstream.md) when detailed naming, error handling, test design, or code-smell examples are useful. Its references to other ECC skills and rules describe the full upstream package; only the four skills listed in `AGENTS.md` are included here.
