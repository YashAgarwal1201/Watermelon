# vite-hostapp — Vue 3 Host Shell

The main container shell application for the Watermelon microfrontend playground. Built with **Vue 3**, **Vite 7**, **Pinia**, **Vue Router**, **PrimeVue 4**, and **Tailwind CSS v4**.

---

## Role & Responsibilities

- **Host Shell**: Provides top navigation, theme toggling (light/dark mode), tab routing, and responsive layouts.
- **Remote Orchestration**: Dynamically loads and renders remote microfrontends built with React, Vue, Svelte, SolidJS, and Angular.
- **Shared Dependencies**: Provides singleton instances of `vue`, `vue-router`, `react`, and `react-dom` to avoid duplicate bundles across federated boundaries.
- **Error Boundaries & Fallbacks**: Handles remote connection timeouts, loading states, and recovery wrappers.

---

## Federated Remotes Configuration

Configured dynamically in [`vite.config.ts`](./vite.config.ts) via `@originjs/vite-plugin-federation`. Remote base URLs are resolved from environment variables (`.env`) with local HTTPS fallbacks:

```typescript
const viteReactUrl = sanitizeUrl(env.VITE_REMOTE_VITE_REACT_URL ?? "https://localhost:5251");
const viteVueUrl = sanitizeUrl(env.VITE_REMOTE_VITE_VUE_URL ?? "https://localhost:5252");
const viteSvelteUrl = sanitizeUrl(env.VITE_REMOTE_VITE_SVELTE_URL ?? "https://localhost:5253");
const viteSolidUrl = sanitizeUrl(env.VITE_REMOTE_VITE_SOLID_URL ?? "https://localhost:5254");
const webpackReactUrl = sanitizeUrl(env.VITE_REMOTE_WEBPACK_REACT_URL ?? "https://localhost:5161");
const webpackVueUrl = sanitizeUrl(env.VITE_REMOTE_WEBPACK_VUE_URL ?? "https://localhost:5162");
```

### Environment Variables

Copy `.env.example` to `.env` to configure remote URLs for staging or production:

```sh
cp .env.example .env
```

| Variable | Default (Local HTTPS) | Description |
| :--- | :--- | :--- |
| `VITE_REMOTE_VITE_REACT_URL` | `https://localhost:5251` | React 19 Vite remote base URL |
| `VITE_REMOTE_VITE_VUE_URL` | `https://localhost:5252` | Vue 3 Vite remote base URL |
| `VITE_REMOTE_VITE_SVELTE_URL` | `https://localhost:5253` | Svelte 5 Vite remote base URL |
| `VITE_REMOTE_VITE_SOLID_URL` | `https://localhost:5254` | SolidJS Vite remote base URL |
| `VITE_REMOTE_WEBPACK_REACT_URL` | `https://localhost:5161` | React 19 Webpack remote base URL |
| `VITE_REMOTE_WEBPACK_VUE_URL` | `https://localhost:5162` | Vue 3 Webpack remote base URL |
| `VITE_REMOTE_ANGULAR_URL` | `https://localhost:4201` | Angular 20 Web Component remote base URL |

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local HTTPS development server on `https://localhost:5150` |
| `npm run build` | Compiles typechecks (`vue-tsc -b`) and produces production bundle in `dist/` |
| `npm run preview` | Previews the production build with HTTPS on `https://localhost:5150` |
| `npm run host` | Exposes dev server to external/LAN network (`vite --host`) |

---

## Directory Structure

```
vite-hostapp/
├── src/
│   ├── components/     # UI widgets, Navigation, Home dashboard
│   ├── RemoteWrapper/  # Framework-agnostic remote mounting wrappers
│   ├── stores/         # Pinia stores (theme, layout, navigation)
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Main application container
│   └── main.ts         # Shell bootstrap and PrimeVue initialization
├── vite.config.ts      # Unified Vite & Federation configuration
└── package.json
```
