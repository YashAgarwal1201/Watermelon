#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CERTS_DIR="$ROOT_DIR/certs"

if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed. Please install it first:"
    echo "   Linux: sudo apt install libnss3-tools && brew install mkcert (or download binary)"
    echo "   macOS: brew install mkcert"
    echo "   Windows: choco install mkcert"
    exit 1
fi

mkdir -p "$CERTS_DIR"

echo "🔐 Installing local CA (if not already installed)..."
mkcert -install

echo "📜 Generating local development certificates in certs/..."
mkcert -key-file "$CERTS_DIR/localhost-key.pem" -cert-file "$CERTS_DIR/localhost.pem" localhost 127.0.0.1 ::1

echo "✅ Certificates generated successfully at:"
echo "   - $CERTS_DIR/localhost.pem"
echo "   - $CERTS_DIR/localhost-key.pem"
