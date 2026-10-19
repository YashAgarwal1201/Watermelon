#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Ensure certificates exist
if [ ! -f "$ROOT_DIR/certs/localhost.pem" ] || [ ! -f "$ROOT_DIR/certs/localhost-key.pem" ]; then
  echo "🔒 [Watermelon] Generating local development SSL certificates..."
  bash "$SCRIPT_DIR/generate-certs.sh"
fi

# Ensure prebuilt dist exists for static remotes
ensure_dist() {
  local app="$1"
  local check_path="$ROOT_DIR/$app/dist"
  if [ "$app" = "angular-remoteapp" ]; then
    check_path="$ROOT_DIR/$app/dist/angular-remoteapp/browser"
  fi

  if [ ! -d "$check_path" ]; then
    echo "📦 Building missing production dist for $app..."
    (cd "$ROOT_DIR/$app" && npm run build)
  fi
}

ensure_all_dists() {
  echo "🔍 Verifying prebuilt bundles for static remotes..."
  ensure_dist "vite-remoteapp-1"
  ensure_dist "vite-remoteapp-2"
  ensure_dist "vite-remoteapp-3"
  ensure_dist "vite-remoteapp-4"
  ensure_dist "webpack-remoteapp-1"
  ensure_dist "webpack-remoteapp-2"
  ensure_dist "angular-remoteapp"
}

# Parse argument
TARGET=""
for arg in "$@"; do
  case $arg in
    --remote=*|-r=*)
      TARGET="${arg#*=}"
      ;;
    --all|-a)
      TARGET="all"
      ;;
    --help|-h)
      echo "Watermelon Selective Development Runner"
      echo ""
      echo "Usage: npm run dev [-- --remote=<target>]"
      echo ""
      echo "Targets:"
      echo "  host           Run host shell only (all 7 remotes served statically)  [~200 MB RAM]"
      echo "  angular        Host + Angular live dev server, rest static            [~650 MB RAM]"
      echo "  v-react        Host + Vite React live dev server, rest static         [~350 MB RAM]"
      echo "  v-vue          Host + Vite Vue live dev server, rest static           [~350 MB RAM]"
      echo "  v-svelte       Host + Vite Svelte live dev server, rest static        [~350 MB RAM]"
      echo "  v-solid        Host + Vite SolidJS live dev server, rest static       [~350 MB RAM]"
      echo "  w-react        Host + Webpack React live dev server, rest static      [~500 MB RAM]"
      echo "  w-vue          Host + Webpack Vue live dev server, rest static        [~500 MB RAM]"
      echo "  all            Run ALL 8 live bundlers concurrently                   [~2.5 GB RAM]"
      exit 0
      ;;
    *)
      if [ -z "$TARGET" ]; then
        TARGET="$arg"
      fi
      ;;
  esac
done

# If no target specified and running in interactive terminal, prompt user
if [ -z "$TARGET" ]; then
  if [ -t 0 ]; then
    echo ""
    echo "🍉 ─────────────────────────────────────────────────────────────"
    echo "   Watermelon Microfrontends — Selective Development Runner"
    echo "   Save 70-90% RAM by developing only what you're working on!"
    echo "───────────────────────────────────────────────────────────────"
    echo "  [1] Host Shell Only      (All 7 remotes static)    ~200 MB RAM"
    echo "  [2] Angular Remote       (Host + Angular live)     ~650 MB RAM"
    echo "  [3] Vite React Remote    (Host + React live)       ~350 MB RAM"
    echo "  [4] Vite Vue Remote      (Host + Vue live)         ~350 MB RAM"
    echo "  [5] Vite Svelte Remote   (Host + Svelte live)      ~350 MB RAM"
    echo "  [6] Vite Solid Remote    (Host + Solid live)       ~350 MB RAM"
    echo "  [7] Webpack React Remote (Host + W-React live)     ~500 MB RAM"
    echo "  [8] Webpack Vue Remote   (Host + W-Vue live)       ~500 MB RAM"
    echo "  [9] ALL 8 Live Bundlers  (Heavy full stack mode)   ~2.5 GB RAM"
    echo "───────────────────────────────────────────────────────────────"
    read -p "Select option [1-9] (default: 1): " choice
    case "$choice" in
      2|angular) TARGET="angular" ;;
      3|v-react|react) TARGET="v-react" ;;
      4|v-vue|vue) TARGET="v-vue" ;;
      5|v-svelte|svelte) TARGET="v-svelte" ;;
      6|v-solid|solid) TARGET="v-solid" ;;
      7|w-react|webpack-react) TARGET="w-react" ;;
      8|w-vue|webpack-vue) TARGET="w-vue" ;;
      9|all) TARGET="all" ;;
      *) TARGET="host" ;;
    esac
  else
    TARGET="host"
  fi
fi

# Normalize target name
case "$TARGET" in
  1|host|hostapp) TARGET="host" ;;
  2|angular|ng|angular-remoteapp) TARGET="angular" ;;
  3|v-react|react|vite-react|vite-remoteapp-1) TARGET="v-react" ;;
  4|v-vue|vue|vite-vue|vite-remoteapp-2) TARGET="v-vue" ;;
  5|v-svelte|svelte|vite-svelte|vite-remoteapp-3) TARGET="v-svelte" ;;
  6|v-solid|solid|solidjs|vite-solid|vite-remoteapp-4) TARGET="v-solid" ;;
  7|w-react|webpack-react|webpack-remoteapp-1) TARGET="w-react" ;;
  8|w-vue|webpack-vue|webpack-remoteapp-2) TARGET="w-vue" ;;
  9|all) TARGET="all" ;;
esac

# Clean ports first
bash "$SCRIPT_DIR/kill-ports.sh"

if [ "$TARGET" = "all" ]; then
  exec bash "$SCRIPT_DIR/start-all.sh"
fi

# Ensure prebuilt bundles exist for inactive remotes
ensure_all_dists

echo ""
echo "🚀 [Watermelon] Starting selective dev mode for target: $TARGET"
echo "──────────────────────────────────────────────────────────────────────────"

case "$TARGET" in
  host)
    npx --yes concurrently -k \
      -n "static-remotes,host" \
      -c "cyan.bold,blue.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp"
    ;;

  angular)
    npx --yes concurrently -k \
      -n "static-remotes,host,angular-live" \
      -c "cyan.bold,blue.bold,magenta.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=angular" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/angular-remoteapp"
    ;;

  v-react)
    npx --yes concurrently -k \
      -n "static-remotes,host,v-react-live" \
      -c "cyan.bold,blue.bold,green.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=vite-react" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/vite-remoteapp-1"
    ;;

  v-vue)
    npx --yes concurrently -k \
      -n "static-remotes,host,v-vue-live" \
      -c "cyan.bold,blue.bold,green.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=vite-vue" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/vite-remoteapp-2"
    ;;

  v-svelte)
    npx --yes concurrently -k \
      -n "static-remotes,host,v-svelte-live" \
      -c "cyan.bold,blue.bold,yellow.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=vite-svelte" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/vite-remoteapp-3"
    ;;

  v-solid)
    npx --yes concurrently -k \
      -n "static-remotes,host,v-solid-live" \
      -c "cyan.bold,blue.bold,yellow.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=vite-solid" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/vite-remoteapp-4"
    ;;

  w-react)
    npx --yes concurrently -k \
      -n "static-remotes,host,w-react-live" \
      -c "cyan.bold,blue.bold,red.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=webpack-react" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run start --prefix $ROOT_DIR/webpack-remoteapp-1"
    ;;

  w-vue)
    npx --yes concurrently -k \
      -n "static-remotes,host,w-vue-live" \
      -c "cyan.bold,blue.bold,red.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=webpack-vue" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run dev --prefix $ROOT_DIR/webpack-remoteapp-2"
    ;;

  *)
    echo "Unknown target: $TARGET"
    exit 1
    ;;
esac
