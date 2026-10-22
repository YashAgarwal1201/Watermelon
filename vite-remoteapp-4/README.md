# vite-remoteapp-4: SolidJS Remote

A federated microfrontend built with **SolidJS**, **TypeScript**, and **Vite 7** (`vite-plugin-solid`).

---

## Federation Details

- **Federation Library**: `@originjs/vite-plugin-federation`
- **Federation Name**: `vite_solidjs_remoteapp`
- **Filename**: `remoteEntry.js` (emitted to `dist/assets/remoteEntry.js`)
- **Exposed Component**:
  ```typescript
  exposes: {
    "./ViteSolidRemoteComponent": "./src/App.tsx",
  }
  ```
- **Shared Dependencies**: `solid-js`
- **CSS Strategy**: Uses `cssInjectedByJsPlugin()` to bundle styles directly into JS entry chunks, ensuring that component styles load cleanly without external `<link>` tag dependencies in the host.

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs standalone SolidJS SPA with HMR | `5254` |
| `npm run build` | Compiles typechecks (`tsc -b`) and bundles federation output | N/A |
| `npm run preview` | Serves `dist/` production preview | `5254` |
| `npm start` | Builds then serves preview for host integration | `5254` |
