#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🍉 Welcome to Watermelon Microfrontend Setup!"
echo "════════════════════════════════════════════════════════════"

# 1. Install root dependencies (concurrently, etc.)
echo ""
echo "📦 Step 1/4: Installing root monorepo tooling..."
(cd "$ROOT_DIR" && npm install)

# 2. Install all sub-application dependencies
echo ""
echo "📦 Step 2/4: Installing sub-application dependencies..."
bash "$SCRIPT_DIR/install-all.sh"

# 3. Generate mkcert SSL certificates
echo ""
echo "🔐 Step 3/4: Setting up local HTTPS certificates..."
bash "$SCRIPT_DIR/generate-certs.sh"

# 4. Setup Git pre-push hook
echo ""
echo "🛡️  Step 4/4: Configuring git pre-push validation hook..."
bash "$SCRIPT_DIR/setup-hooks.sh"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "🎉 Watermelon environment setup is complete!"
echo ""
echo "To launch all 8 applications over HTTPS in a single terminal:"
echo "   npm run start:all"
echo ""
echo "Or start them individually:"
echo "   vite-hostapp:         https://localhost:5150"
echo "   vite-remoteapp-1:     https://localhost:5251"
echo "   vite-remoteapp-2:     https://localhost:5252"
echo "   vite-remoteapp-3:     https://localhost:5253"
echo "   vite-remoteapp-4:     https://localhost:5254"
echo "   webpack-remoteapp-1:  https://localhost:5161"
echo "   webpack-remoteapp-2:  https://localhost:5162"
echo "   angular-remoteapp:    https://localhost:4201"
echo "════════════════════════════════════════════════════════════"
