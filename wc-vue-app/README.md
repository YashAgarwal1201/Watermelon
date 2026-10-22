# wc-vue-app: Vue 3 User Profile Custom Element

A microfrontend component authored in **Vue 3** and compiled into a standalone W3C Custom Element using `@vitejs/plugin-vue` with `{ customElement: true }`.

---

## Architecture and Integration Details

- **Isolation Strategy**: Native Shadow DOM (W3C Custom Element standard)
- **Custom Element Tag**: `<wm-user-profile>`
- **Port**: `5303`
- **Protocol**: HTTPS (local certs via mkcert)
- **Host Integration**: Dynamically imported and mounted by `WebComponentAdapter`
- **CSS Strategy**: Scoped encapsulated styles within the custom element ShadowRoot
- **Cross-Boundary Communication**:
  - Properties / Attributes: Accepts `theme` (`"dark"` or `"light"`)
  - DOM Custom Events: Dispatches `wm-signout` when the user clicks sign out

---

## Ports and Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs Vite dev server with middleware rewriting `/main.js` | `5303` |
| `npm run build` | Compiles TypeScript and packages ES library bundle to `dist/main.js` | N/A |
| `npm run preview` | Serves compiled ES library over HTTPS | `5303` |

---

## Lifecycle Guarantee

The custom element implementation utilizes Vue 3 custom element definition lifecycle hooks to unmount the reactive application context and detach all listeners when disconnected from the DOM tree.
