---
name: ecc-security-review
description: Apply ECC security review to EduStart contact links, DOM content, configuration, file handling, credentials, external integrations, and automation changes.
---

# ECC security review for EduStart

Read `AGENTS.md` and current `HANDOFF.md`. Review the changed behavior and its trust boundaries.

1. Inspect user-controlled data, DOM writes, dynamic URLs, file paths, shell arguments, and external-service calls.
2. Prefer `textContent` for plain text. Validate dynamic contact URLs and allowed protocols. Check `target` and `rel` on external links.
3. Keep demo contacts inert during QA. Do not place real credentials or personal contact data in shipped demo configuration.
4. Review path traversal, command injection, timeouts, error handling, and log redaction in Node.js tools.
5. Keep secrets in the environment's supported credential mechanism. Never print credential values or include local logs, signed URLs, or `.automation/` in commits.
6. For Notion or other external actions, use only the authority in the current user request. Preserve the existing reviewer, schedule, lock, and ledger boundaries.
7. Apply authentication, SQL, CSRF, payment, and backend checks only if the feature exists. Record absent features as not applicable.
8. Inspect dependency changes only when dependencies exist. Do not run automatic dependency upgrades or audit fixes as part of a read-only review.

Read [the pinned ECC checklist](references/upstream.md) for relevant examples. Generic sample security headers are not production defaults; avoid introducing permissive script directives just to copy an example.

Report concrete findings with affected files, triggers, severity, and a minimal fix. State the reviewed scope and checks performed; do not claim a full security audit from a pattern search alone.
