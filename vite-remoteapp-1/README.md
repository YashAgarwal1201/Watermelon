# vite-remoteapp-1: React 19 Remote

A federated microfrontend built with **React 19**, **PrimeReact**, **Tailwind CSS v4**, and **Vite 7**.

---

## Federation Details

- **Federation Library**: `@originjs/vite-plugin-federation`
- **Federation Name**: `vite_react_remoteapp`
- **Filename**: `remoteEntry.js` (emitted to `dist/assets/remoteEntry.js`)
- **Exposed Component**:
  ```typescript
  exposes: {
    "./ViteReactRemoteComponent": "./src/App.tsx",
  }
  ```
- **Shared Dependencies**: `react`, `react-dom`, `primereact`
- **CSS Strategy**: Custom `injectCssIntoJs()` Rollup plugin collects generated styles and injects them via JS to ensure styles load correctly when dynamically imported into the host shell.

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs standalone SPA with fast unbundled HMR | `5251` |
| `npm run build` | Runs TypeScript check (`tsc -b`) and bundles federation output | N/A |
| `npm run preview` | Serves `dist/` production preview | `5251` |
| `npm start` | Builds then serves preview (ready for host integration) | `5251` |
| `npm run lint` | Runs ESLint analysis across TypeScript & React components | N/A |

---

## Standalone vs. Host Routing

In [`src/App.tsx`](./src/App.tsx), routing supports dual modes:
```typescript
const basename = (window as Window & { BASENAME?: string }).BASENAME ?? "/";
```
- When mounted inside the host shell, `window.BASENAME` is provided by the host wrapper.
- When running standalone (`npm run dev`), it falls back to `/`.
