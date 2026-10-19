# webpack-remoteapp-2 — Vue 3 (Webpack 5)

A federated microfrontend built with **Vue 3**, **TypeScript**, **Sass**, and **Webpack 5 Module Federation**.

---

## Federation Details

- **Federation Strategy**: Native Webpack 5 `ModuleFederationPlugin`
- **Container Name**: `webpack_vue_remoteapp`
- **Library Format**: `{ type: "var", name: "webpack_vue_remoteapp" }`
- **Filename**: `remoteEntry.js`
- **Exposed Component**:
  ```javascript
  exposes: {
    "./WebpackVueRemoteComponent": "./src/bootstrap",
  }
  ```
- **Shared Dependencies**: `vue`

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm run dev` | Runs Webpack Dev Server with HMR (ready for host federation) | `5162` |
| `npm run build` | Compiles production bundle to `dist/` | — |
| `npm run preview` | Serves `dist/` production preview | — |

---

## Host Integration

The Vue 3 host shell consumes this remote as an external `var` module:

```typescript
// in vite-hostapp/vite.config.ts
webpack_vue_remoteapp: {
  external: "http://localhost:5162/remoteEntry.js",
  from: "webpack",
  format: "var",
}
```
