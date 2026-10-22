# wc-lit-app: Lit 3 Notification Center

A federated microfrontend component implemented as a standard W3C Custom Element using **Lit 3**, **TypeScript**, and **Vite 8**.

---

## Architecture and Integration Details

- **Isolation Strategy**: Native Shadow DOM (W3C Custom Element standard)
- **Custom Element Tag**: `<wm-notification-center>`
- **Port**: `5302`
- **Protocol**: HTTPS (local certs via mkcert)
- **Host Integration**: Dynamically imported and mounted by `WebComponentAdapter`
- **CSS Strategy**: Scoped encapsulated styles within the component's ShadowRoot
- **Cross-Boundary Communication**:
  - Properties / Attributes: Accepts `theme` (`"dark"` or `"light"`)
  - DOM Custom Events: Dispatches `wm-badge-count` when notifications change

---

## Ports and Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs Vite dev server with middleware rewriting `/main.js` | `5302` |
| `npm run build` | Compiles TypeScript and packages ES library bundle to `dist/main.js` | N/A |
| `npm run preview` | Serves compiled ES library over HTTPS | `5302` |

---

## Lifecycle Guarantee

The custom element implementation properly handles `connectedCallback` and `disconnectedCallback` hooks, ensuring timers, event listeners, and shadow DOM nodes are thoroughly cleaned up upon navigation.
