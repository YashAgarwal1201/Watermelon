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
  elif [ "$app" = "iframe-nextjs-app" ]; then
    check_path="$ROOT_DIR/$app/out"
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
  ensure_dist "wc-lit-app"
  ensure_dist "wc-vue-app"
  ensure_dist "iframe-vite-app"
  ensure_dist "iframe-nextjs-app"
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
      echo "  wc-lit         Host + Lit Web Component live dev server, rest static  [~350 MB RAM]"
      echo "  wc-vue         Host + Vue Web Component live dev server, rest static  [~350 MB RAM]"
      echo "  iframe-vite    Host + Vite Iframe live dev server, rest static         [~350 MB RAM]"
      echo "  iframe-nextjs  Host + Next.js Iframe live dev server, rest static      [~550 MB RAM]"
      echo "  all            Run ALL live bundlers concurrently                     [~3.0 GB RAM]"
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
    echo "  [1] Host Shell Only        (All 7 remotes static)    ~200 MB RAM"
    echo "  [2] Angular Remote         (Host + Angular live)     ~650 MB RAM"
    echo "  [3] Vite React Remote      (Host + React live)       ~350 MB RAM"
    echo "  [4] Vite Vue Remote        (Host + Vue live)         ~350 MB RAM"
    echo "  [5] Vite Svelte Remote     (Host + Svelte live)      ~350 MB RAM"
    echo "  [6] Vite Solid Remote      (Host + Solid live)       ~350 MB RAM"
    echo "  [7] Webpack React Remote   (Host + W-React live)     ~500 MB RAM"
    echo "  [8] Webpack Vue Remote     (Host + W-Vue live)       ~500 MB RAM"
    echo "  [9] Lit Web Component      (Host + Lit live)         ~350 MB RAM"
    echo "  [10] Vue Custom Element    (Host + Vue CE live)      ~350 MB RAM"
    echo "  [11] Vite Iframe Remote    (Host + Iframe Vite live) ~350 MB RAM"
    echo "  [12] Next.js Iframe Remote (Host + Iframe Next live) ~550 MB RAM"
    echo "  [13] ALL Live Bundlers     (Heavy full stack mode)   ~3.0 GB RAM"
    echo "───────────────────────────────────────────────────────────────"
    read -p "Select option [1-13] (default: 1): " choice
    case "$choice" in
      2|angular) TARGET="angular" ;;
      3|v-react|react) TARGET="v-react" ;;
      4|v-vue|vue) TARGET="v-vue" ;;
      5|v-svelte|svelte) TARGET="v-svelte" ;;
      6|v-solid|solid) TARGET="v-solid" ;;
      7|w-react|webpack-react) TARGET="w-react" ;;
      8|w-vue|webpack-vue) TARGET="w-vue" ;;
      9|wc-lit|lit) TARGET="wc-lit" ;;
      10|wc-vue|vue-wc) TARGET="wc-vue" ;;
      11|iframe-vite|iframe-react) TARGET="iframe-vite" ;;
      12|iframe-nextjs|iframe-next|nextjs) TARGET="iframe-nextjs" ;;
      13|all) TARGET="all" ;;
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
  9|wc-lit|lit|wc-lit-app) TARGET="wc-lit" ;;
  10|wc-vue|vue-wc|wc-vue-app) TARGET="wc-vue" ;;
  11|iframe-vite|iframe-react|iframe-vite-app) TARGET="iframe-vite" ;;
  12|iframe-nextjs|iframe-next|nextjs|iframe-nextjs-app) TARGET="iframe-nextjs" ;;
  13|all) TARGET="all" ;;
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

  wc-lit)
    npx --yes concurrently -k \
      -n "static-remotes,host,wc-lit-live" \
      -c "cyan.bold,blue.bold,cyan.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=wc-lit" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run dev --prefix $ROOT_DIR/wc-lit-app"
    ;;

  wc-vue)
    npx --yes concurrently -k \
      -n "static-remotes,host,wc-vue-live" \
      -c "cyan.bold,blue.bold,green.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=wc-vue" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run dev --prefix $ROOT_DIR/wc-vue-app"
    ;;

  iframe-vite)
    npx --yes concurrently -k \
      -n "static-remotes,host,iframe-vite-live" \
      -c "cyan.bold,blue.bold,yellow.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=iframe-vite" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run dev --prefix $ROOT_DIR/iframe-vite-app"
    ;;

  iframe-nextjs)
    npx --yes concurrently -k \
      -n "static-remotes,host,iframe-nextjs-live" \
      -c "cyan.bold,blue.bold,magenta.bold" \
      "node $SCRIPT_DIR/serve-remotes.mjs --exclude=iframe-nextjs" \
      "npm run dev --prefix $ROOT_DIR/vite-hostapp" \
      "npm run dev --prefix $ROOT_DIR/iframe-nextjs-app"
    ;;

  *)
    echo "Unknown target: $TARGET"
    exit 1
    ;;
esac
