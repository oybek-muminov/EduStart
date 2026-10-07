---
name: ecc-tdd-workflow
description: Use ECC's test-first workflow for substantive EduStart JavaScript or Node.js behavior changes, bug fixes, and refactors with the repository's existing Node.js test runner.
---

# ECC test-driven workflow for EduStart

Read `AGENTS.md` and current `HANDOFF.md`. EduStart has no `package.json`; its existing unit tests use `node:test`.

## Resolve the test runner

Use `node --test path/to/affected.test.cjs`. Inspect the affected tests before running them. Do not call the full ECC package-manager detector, which is not bundled in this integration. Do not add Jest, Vitest, Bun, React, or a build system to follow an upstream example.

## Implement a behavior change

1. Write the expected user-visible behavior and an observable failure case.
2. Run the relevant existing tests and record the baseline. The documented EN inventory failure in the automation suite is pre-existing.
3. Add a focused regression test for the changed behavior. Confirm it fails for the intended reason.
4. Implement the smallest fix, run the test again, then refactor only as needed.
5. Cover meaningful error paths and boundary cases. Avoid tests that repeat implementation details.
6. Keep tests isolated. Use temporary files and local fixtures; never publish, schedule jobs, contact users, or write to production services from tests.
7. For UI behavior, use real-browser QA when a supported browser is available. Static checks are not a substitute for interactions or visual results.
8. Use coverage only when the project has a working coverage command. Report unmeasured coverage honestly; a target is not a measured result.

Documentation-only and metadata-only edits do not require artificial regression tests. Run integrity and syntax checks appropriate to the change.

Read [the pinned ECC workflow](references/upstream.md) for test-design and isolation examples. Its package-manager, framework, coverage, and CI examples apply only when those facilities exist in this repository.
