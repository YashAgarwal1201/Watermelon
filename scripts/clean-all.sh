#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🧹 [Watermelon] Cleaning build outputs across all applications..."

APPS=(
    "vite-hostapp"
    "vite-remoteapp-1"
    "vite-remoteapp-2"
    "vite-remoteapp-3"
    "vite-remoteapp-4"
    "webpack-remoteapp-1"
    "webpack-remoteapp-2"
    "angular-remoteapp"
)

for APP in "${APPS[@]}"; do
    rm -rf "$ROOT_DIR/$APP/dist" "$ROOT_DIR/$APP/dist-ssr" "$ROOT_DIR/$APP/.angular"
done

echo "✅ Cleaned all dist/ and build artifact directories."
