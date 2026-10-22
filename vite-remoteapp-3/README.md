# vite-remoteapp-3 : Svelte 5 Remote

A federated microfrontend built with **Svelte 5**, **TypeScript**, **Sass**, and **Vite 7**.

---

## Federation Details

- **Federation Library**: `@originjs/vite-plugin-federation`
- **Federation Name**: `vite_svelte_remoteapp`
- **Filename**: `remoteEntry.js` (emitted to `dist/assets/remoteEntry.js`)
- **Exposed Component**:
  ```typescript
  exposes: {
    "./ViteSvelteRemoteComponent": "./src/App.svelte",
  }
  ```
- **Shared Dependencies**: `svelte`
- **Svelte 4 Compatibility Mode**: Configured with `compatibility: { componentApi: 4 }` in `svelte({ ... })` compiler options to ensure compatibility with standard mounting wrappers across host frameworks.

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs standalone Svelte 5 SPA with HMR | `5253` |
| `npm run build` | Compiles production federation bundle | N/A |
| `npm run check` | Runs `svelte-check` diagnostics and TypeScript typechecks | N/A |
| `npm run preview` | Serves `dist/` production preview | `5253` |
| `npm start` | Builds then serves preview for host integration | `5253` |
