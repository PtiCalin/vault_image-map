#!/usr/bin/env bash

# =========================================================
# File: setup.sh
# Purpose: Set up the project by installing dependencies and
#          building the Image Map plugin.
#
# Dependencies:
#   - bash
#   - npm
#   - Node.js (>=18)
#   - optional Codex for network setup
#
# Output: dist/ directory populated with compiled assets.
# =========================================================


set -euo pipefail

# Parse flags
dry_run=false
for arg in "$@"; do
  case "$arg" in
    --dry-run)
      dry_run=true
      ;;
  esac
done

# Helper to run commands or echo when dry running
run() {
  echo "+ $*"
  if [[ "$dry_run" != true ]]; then
    "$@"
  fi
}

# === CONFIGURATION ===
# Optional: request network access in Codex environments
if [[ -n "${CODEX_ENABLE_NETWORK:-}" ]]; then
  if command -v codex >/dev/null 2>&1; then
    codex configure network enable || true
  fi
fi

# === MAIN EXECUTION ===
run npm install
run npm run build

# === CLEANUP ===
# Nothing to clean up

