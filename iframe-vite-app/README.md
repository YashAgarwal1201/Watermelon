# iframe-vite-app: React 19 Asset and Media Manager

An isolated microfrontend built with **React 19**, **TypeScript**, and **Vite 8**, running inside a sandboxed iframe.

---

## Architecture and Isolation Details

- **Isolation Strategy**: Hardened iframe sandboxing (`sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`)
- **Port**: `5300`
- **Protocol**: HTTPS (local certs via mkcert)
- **Host Integration**: Mounted via `IframeAdapter` within the host shell
- **Cross-Boundary Communication**: `@watermelon/bridge` bidirectional `postMessage` protocol
- **Event Validation**: Strict origin whitelisting (`allowedOrigins`) and `event.source === iframe.contentWindow` verification
- **Supported Bridge Events**:
  - `ASSET_SELECTED`: Emits selected asset payload to host
  - `NAVIGATE`: Coordinates routing transitions with host
  - `THEME_CHANGED`: Receives host theme updates (`dark` / `light`)
  - `AUTH_TOKEN_SYNC`: Receives authenticated session tokens

---

## Ports and Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs Vite dev server with HTTPS | `5300` |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles production assets | N/A |
| `npm run preview` | Serves production build preview | `5300` |
| `npm run lint` | Runs Oxlint linter checks | N/A |

---

## Fault Isolation Guarantee

Exceptions occurring within this remote are completely contained within its browser browsing context. If an uncaught runtime exception triggers in the React tree, the host shell remains fully operational, and the internal `RemoteErrorBoundary` catches and displays recovery actions without impacting sibling microfrontends.
