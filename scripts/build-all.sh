#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

START_TIME=$(date +%s)

echo "🚀 [Watermelon] Building all 8 applications for production..."
echo "─────────────────────────────────────────────────────────────"

REMOTES=(
    "vite-remoteapp-1"
    "vite-remoteapp-2"
    "vite-remoteapp-3"
    "vite-remoteapp-4"
    "webpack-remoteapp-1"
    "webpack-remoteapp-2"
    "angular-remoteapp"
    "wc-lit-app"
    "wc-vue-app"
    "iframe-vite-app"
    "iframe-nextjs-app"
)

for REMOTE in "${REMOTES[@]}"; do
    echo "  📦 Building remote: $REMOTE..."
    (cd "$ROOT_DIR/$REMOTE" && npm run build)
done

echo "  📦 Building host: vite-hostapp..."
(cd "$ROOT_DIR/vite-hostapp" && npm run build)

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "✅ All applications built successfully in ${DURATION}s!"
