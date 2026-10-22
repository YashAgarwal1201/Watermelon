# iframe-nextjs-app: Next.js 16 App Router Analytics Dashboard

An isolated microfrontend built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, running inside a sandboxed iframe.

---

## Architecture and Isolation Details

- **Isolation Strategy**: Hardened iframe sandboxing (`sandbox="allow-scripts allow-same-origin allow-forms allow-popups"`)
- **Port**: `5301`
- **Protocol**: HTTPS (local certs via mkcert)
- **Host Integration**: Mounted via `IframeAdapter` within the host shell
- **Cross-Boundary Communication**: `@watermelon/bridge` bidirectional `postMessage` protocol
- **Event Validation**: Strict origin whitelisting (`allowedOrigins`) and `event.source === iframe.contentWindow` verification
- **Supported Bridge Events**:
  - `ANALYTICS_FILTER_CHANGED`: Emits active filter and date range selections to the host
  - `THEME_CHANGED`: Receives theme updates (`dark` / `light`) synchronized from the host
  - `AUTH_TOKEN_SYNC`: Receives authenticated session tokens

---

## Ports and Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs Next.js Turbopack dev server with HTTPS | `5301` |
| `npm run build` | Compiles Next.js production build | N/A |
| `npm start` | Starts Next.js production server | `5301` |
| `npm run preview` | Serves exported static output over HTTPS | `5301` |
| `npm run lint` | Runs Next.js ESLint analysis | N/A |

---

## Fault Isolation Guarantee

As an independent browser execution context, Next.js hydration failures, runtime exceptions, or memory leaks cannot compromise the host shell. Internal crash simulation demonstrates recovery via an in-frame error boundary without disrupting the outer application lifecycle.
