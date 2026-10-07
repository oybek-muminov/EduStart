#!/usr/bin/env bash
# Offline preflight for EduStart's repository-scoped ECC workflows.
set -euo pipefail

EDUSTART_REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$EDUSTART_REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 18 or newer is required in this cloud environment." >&2
  exit 1
fi

node -e 'if (Number(process.versions.node.split(".")[0]) < 18) { console.error("Node.js 18 or newer is required."); process.exit(1); }'
node tools/check-ecc.cjs
echo "ECC repository files are prepared. Verify skill discovery in a new Codex Cloud task."
