#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Free any ports held by orphaned background processes
bash "$SCRIPT_DIR/kill-ports.sh"

# Ensure prebuilt bundles exist before previewing
for app in "vite-remoteapp-1" "vite-remoteapp-2" "vite-remoteapp-3" "vite-remoteapp-4" "wc-lit-app" "wc-vue-app" "iframe-vite-app"; do
  if [ ! -d "$ROOT_DIR/$app/dist" ]; then
    echo "📦 Building missing $app bundle..."
    (cd "$ROOT_DIR/$app" && npm run build)
  fi
done

if [ ! -d "$ROOT_DIR/iframe-nextjs-app/out" ]; then
  echo "📦 Building missing iframe-nextjs-app bundle..."
  (cd "$ROOT_DIR/iframe-nextjs-app" && npm run build)
fi

echo ""
echo "🚀 [Watermelon] Launching Host Shell and Remotes over HTTPS..."
echo "──────────────────────────────────────────────────────────────────"

npx --yes concurrently -k \
  -n "host,v-react,v-vue,v-svelte,v-solid,w-react,w-vue,angular,wc-lit,wc-vue,iframe-vite,iframe-nextjs" \
  -c "blue.bold,cyan.bold,green.bold,magenta.bold,yellow.bold,red.bold,white.bold,cyanBright.bold,magentaBright.bold,greenBright.bold,yellowBright.bold,magenta.bold" \
  "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
  "npm run preview --prefix $ROOT_DIR/vite-remoteapp-1" \
  "npm run preview --prefix $ROOT_DIR/vite-remoteapp-2" \
  "npm run preview --prefix $ROOT_DIR/vite-remoteapp-3" \
  "npm run preview --prefix $ROOT_DIR/vite-remoteapp-4" \
  "npm run start --prefix $ROOT_DIR/webpack-remoteapp-1" \
  "npm run dev --prefix $ROOT_DIR/webpack-remoteapp-2" \
  "npm run start --prefix $ROOT_DIR/angular-remoteapp" \
  "npm run preview --prefix $ROOT_DIR/wc-lit-app" \
  "npm run preview --prefix $ROOT_DIR/wc-vue-app" \
  "npm run preview --prefix $ROOT_DIR/iframe-vite-app" \
  "npm run preview --prefix $ROOT_DIR/iframe-nextjs-app"
