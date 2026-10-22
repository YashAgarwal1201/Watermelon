# webpack-remoteapp-1: React 19 (Webpack 5)

A federated microfrontend built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Webpack 5 Module Federation**.

---

## Federation Details

- **Federation Strategy**: Native Webpack 5 `ModuleFederationPlugin`
- **Container Name**: `webpack_react_remoteapp`
- **Library Format**: `{ type: "var", name: "webpack_react_remoteapp" }`
- **Filename**: `remoteEntry.js`
- **Exposed Component**:
  ```javascript
  exposes: {
    "./WebpackReactRemoteComponent": "./src/App",
  }
  ```
- **Shared Dependencies**: `react`, `react-dom`

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm start` | Runs Webpack Dev Server (ready for host federation) | `5161` |
| `npm run dev` | Runs Webpack Dev Server and opens browser | `5161` |
| `npm run build` | Compiles production bundle to `dist/` | N/A |
| `npm run type-check` | Runs TypeScript type checking (`tsc --noEmit`) | N/A |

---

## Host Integration

The Vue 3 host shell consumes this remote as an external `var` module:

```typescript
// in vite-hostapp/vite.config.ts
webpack_react_remoteapp: {
  external: "http://localhost:5161/remoteEntry.js",
  from: "webpack",
  format: "var",
}
```
