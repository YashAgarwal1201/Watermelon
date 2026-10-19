# vite-remoteapp-2 — Vue 3 Remote

A federated microfrontend built with **Vue 3**, **PrimeVue 4**, **Tailwind CSS v4**, and **Vite 7**.

---

## Federation Details

- **Federation Library**: `@originjs/vite-plugin-federation`
- **Federation Name**: `vite_vue_remoteapp`
- **Filename**: `remoteEntry.js` (emitted to `dist/assets/remoteEntry.js`)
- **Exposed Component**:
  ```typescript
  exposes: {
    "./ViteVueRemoteComponent": "./src/bootstrap.js",
  }
  ```
- **Shared Dependencies**: `vue`, `vue-router`
- **CSS Strategy**: Uses `injectCssIntoJs()` to inject scoped styles via JS at runtime (`data-remote-css="vite_vue_remoteapp"`), preventing style loss during client routing inside the host.

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs standalone Vue 3 SPA with HMR | `5252` |
| `npm run build` | Runs typecheck (`vue-tsc -b`) and builds federation bundle | — |
| `npm run preview` | Serves `dist/` production preview | `5252` |
| `npm start` | Builds then serves preview for host integration | `5252` |

---

## Bootstrap Pattern

The exposed module is [`src/bootstrap.js`](./src/bootstrap.js), which provides a mounting function that accepts a host container and optional host router context, allowing the Vue 3 component to mount seamlessly into the Vue 3 host shell.
