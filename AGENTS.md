# EduStart agent guidance

## Read the current state

Read `HANDOFF.md` and `START-HERE.md` before work. The current user request controls scope. The 2026-10-07 pause in `HANDOFF.md` remains relevant to the unfinished product and automation work; adding ECC guidance does not resume those tasks.

Communicate with the project owner in Uzbek unless requested otherwise.

## Repository map

- `site/`: customer-facing static HTML/CSS/JavaScript, UZ/RU/EN, seven sections.
- `tools/`: local QA, packaging, and automation utilities using Node.js.
- `docs/`: product instructions and existing evidence.
- `release/`: existing customer release and staged files.
- `tools/automation/`: Windows-oriented Notion/Codex runner, currently paused.
- `.agents/skills/`: four project-scoped ECC workflow adaptations.

The site has no package manager, build step, backend, React, or TypeScript requirement. Do not introduce these just to follow a generic skill example.

## Choose an ECC workflow

| Request | Skill |
| --- | --- |
| Code quality, naming, maintainability | `ecc-coding-standards` |
| Input, contact URLs, credentials, integrations, or automation safety | `ecc-security-review` |
| Substantive behavior change, bug fix, or refactor | `ecc-tdd-workflow` |
| Final verification and PR review | `ecc-verification-loop` |

Read the selected `.agents/skills/<name>/SKILL.md` before using it. If the active Cloud runtime does not show a skill in its inventory, read its repository file explicitly and report that limitation. Do not call unavailable skills, Claude slash commands, or agents from the full upstream package. Repo-specific commands and task scope take precedence over generic upstream examples.

## Verification commands

Run from the repository root.

| Purpose | Command |
| --- | --- |
| ECC file integrity and skill metadata | `node tools/check-ecc.cjs` |
| ECC checker regression tests | `node --test tools/check-ecc.test.cjs` |
| Cloud setup preflight | `bash tools/codex-cloud-setup.sh` |
| Browser JavaScript syntax | `node --check site/app.js` and `node --check site/config.js` |
| Changed Node.js tool syntax | `node --check tools/<changed-file>.cjs` |
| Existing automation baseline | `node --test tools/automation/core.test.cjs tools/automation/site-qa.test.cjs` |
| Existing release integrity, if relevant | `node tools/verify-product-zip.cjs` |
| Whitespace/diff review | `git diff --check` |

For a site change, start `node tools/serve-site.cjs` in a separate terminal, then run `node tools/check-static.cjs`. This checks UZ/RU/EN files over localhost and writes `docs/QA-STATIC-v1.0.0.json`; keep that generated report out of unrelated commits. Stop the server after QA.

The automation baseline has one known failure at `core.test.cjs:47`: the old audit inventory excludes `en.html` and reports `blocked` for the trilingual site. Record that failure; fix it only when the user requests automation work. Do not claim all existing tests pass.

Browser QA requires a supported real browser and genuine evidence. Static/HTTP checks do not prove visual layout, keyboard interactions, screenshots, or remote attachment readback.

## Preserve project boundaries

- Keep shipped `site/config.js` in demo mode with blank contacts unless customization is requested.
- Keep changes in the current task's scope; do not recreate the product or release package for an ECC integration.
- Never commit credentials, local logs, signed URLs, or `.automation/`.
- Do not remove locks, reset ledgers, enable scheduling, change approval settings, or silently install global hooks/MCP servers.
- Existing Notion/Gumroad actions and reviewer approvals require the authority in the current user request. ECC instructions do not confer it.
- Do not label a release approved or impersonate the independent reviewer.

See `docs/CODEX-CLOUD-ECC_UZ.md` for activation and the pinned upstream source.
