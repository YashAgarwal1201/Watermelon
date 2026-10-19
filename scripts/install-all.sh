#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

APPS=(
    "packages/watermelon-bridge"
    "vite-hostapp"
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

echo "📦 [Watermelon] Installing dependencies across all applications..."
echo "──────────────────────────────────────────────────────────────────"

for APP in "${APPS[@]}"; do
    echo "  → Installing dependencies for $APP..."
    (cd "$ROOT_DIR/$APP" && npm install)
    if [ "$APP" = "packages/watermelon-bridge" ]; then
        echo "  → Building @watermelon/bridge..."
        (cd "$ROOT_DIR/$APP" && npm run build)
    fi
done

echo ""
echo "✅ All application dependencies installed successfully!"
