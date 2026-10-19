#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "⚡ [Watermelon] Type-checking all 8 applications..."
echo "─────────────────────────────────────────────────"

echo "  → vite-hostapp (vue-tsc)"
(cd "$ROOT_DIR/vite-hostapp" && npx vue-tsc -b)

echo "  → vite-remoteapp-1 (tsc)"
(cd "$ROOT_DIR/vite-remoteapp-1" && npx tsc -b)

echo "  → vite-remoteapp-2 (vue-tsc)"
(cd "$ROOT_DIR/vite-remoteapp-2" && npx vue-tsc -b)

echo "  → vite-remoteapp-3 (svelte-check & tsc)"
(cd "$ROOT_DIR/vite-remoteapp-3" && npm run check)

echo "  → vite-remoteapp-4 (tsc)"
(cd "$ROOT_DIR/vite-remoteapp-4" && npx tsc -b)

echo "  → webpack-remoteapp-1 (tsc)"
(cd "$ROOT_DIR/webpack-remoteapp-1" && npm run type-check)

echo "  → webpack-remoteapp-2 (tsc)"
(cd "$ROOT_DIR/webpack-remoteapp-2" && npx tsc --noEmit)

echo "  → angular-remoteapp (tsc)"
(cd "$ROOT_DIR/angular-remoteapp" && npx tsc --noEmit)

echo ""
echo "✅ All 8 applications passed static type-checking!"
