---
name: ecc-verification-loop
description: Verify an EduStart change before reporting completion or opening a pull request using ECC's build, syntax, test, security, and diff review phases adapted to Codex Cloud.
---

# ECC verification loop for EduStart

Read `AGENTS.md` and current `HANDOFF.md`. Select checks that match the changed files.

## Verification phases

1. **Integration integrity:** Run `node tools/check-ecc.cjs` when ECC files change. This verifies files and metadata, not whether the current Codex session discovered the skills.
2. **Runtime and syntax:** Run `node --check` on changed JavaScript/CommonJS files and `bash -n` on changed shell scripts.
3. **Build/types/lint:** EduStart currently has no build, TypeScript, or configured lint step. Report these as not applicable; do not run npm or install tools to create a missing gate.
4. **Tests:** Run relevant `node --test` suites. The automation suite has a documented EN inventory baseline failure. Report new failures separately and do not change or suppress unrelated tests to make the report green.
5. **Site checks:** For site changes, run the localhost/static checks in `AGENTS.md`. Keep generated QA output in a temporary copy or review and restore any unrelated historical report. Run real-browser QA for visual/interaction claims and state when unavailable.
6. **Security:** Review the changed trust boundaries with `ecc-security-review` when applicable. Do not print found credential values.
7. **Diff:** Run `git diff --check` and inspect all changed files. Confirm that customer release files and unrelated automation state changed only when explicitly requested.

## Report the result

Report each executed command and its outcome, relevant skipped checks, pre-existing failures, new failures, and any limitation. Distinguish "ECC files verified", "skills visible in this session", and "workflow executed": they are different observations.

Use `PASS`, `FAIL`, `NOT RUN`, or `N/A` per phase. State readiness for the specific change without claiming the entire product passed. Do not approve a release, merge a candidate, publish to Gumroad, or activate the scheduler on behalf of a reviewer.

Read [the pinned ECC verification phases](references/upstream.md) for the original sequence. Claude slash commands, hooks, and npm examples are not part of this Codex Cloud integration.
