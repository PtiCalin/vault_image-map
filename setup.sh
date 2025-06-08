#!/usr/bin/env bash
# Setup script for the Image Map plugin
# It installs dependencies and builds the project.
set -euo pipefail

# Optional: request network access in Codex environments
if [[ -n "${CODEX_ENABLE_NETWORK:-}" ]]; then
  if command -v codex >/dev/null 2>&1; then
    codex configure network enable || true
  fi
fi

npm install
npm run build

