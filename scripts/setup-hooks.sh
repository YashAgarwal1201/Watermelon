#!/bin/sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

echo "🔧 Installing Git pre-push hook..."
mkdir -p .git/hooks
cp scripts/git-hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
chmod +x scripts/git-hooks/pre-push

echo "✅ Pre-push hook successfully installed to .git/hooks/pre-push"
