# Watermelon — Microfrontend Architecture Playground

A polyglot microfrontend playground demonstrating multiple federation strategies
and framework integrations under one monorepo. The Vue 3 host app consumes remote
apps built with React, Vue, Svelte, SolidJS, and Angular — each using a different
bundler or integration approach.

## Project Structure

```

root/
├── vite-hostapp/ # Vue 3 host app
├── vite-remoteapp-1/ # React (Vite + Module Federation)
├── vite-remoteapp-2/ # Vue 3 (Vite + Module Federation)
├── vite-remoteapp-3/ # Svelte (Vite + Module Federation)
├── vite-remoteapp-4/ # SolidJS (Vite + Module Federation)
├── webpack-remoteapp-1/ # React (Webpack 5 + Module Federation)
├── webpack-remoteapp-2/ # Vue 3 (Webpack 5 + Module Federation)
└── angular-remoteapp/ # Angular 20 (Angular Elements / Web Components)

```

## Apps & Ports

| App                   | Framework  | Port | Integration                      |
| --------------------- | ---------- | ---- | -------------------------------- |
| `vite-hostapp`        | Vue 3      | 5150 | Host                             |
| `vite-remoteapp-1`    | React 19   | 5251 | Vite Module Federation           |
| `vite-remoteapp-2`    | Vue 3      | 5252 | Vite Module Federation           |
| `vite-remoteapp-3`    | Svelte 5   | 5253 | Vite Module Federation           |
| `vite-remoteapp-4`    | SolidJS    | 5254 | Vite Module Federation           |
| `webpack-remoteapp-1` | React 19   | 5161 | Webpack Module Federation        |
| `webpack-remoteapp-2` | Vue 3      | 5162 | Webpack Module Federation        |
| `angular-remoteapp`   | Angular 20 | 4201 | Angular Elements (Web Component) |

---

## Running the Project

Each app has its own `node_modules` — run `npm install` inside each folder before starting.

### Step 1 — Start the remote apps

**Vite remotes** need to be built and previewed (not `dev`) so the host can fetch their `remoteEntry.js`:

```sh
# Run each in a separate terminal
cd vite-remoteapp-1 && npm start    # builds then previews on :5251
cd vite-remoteapp-2 && npm start    # builds then previews on :5252
cd vite-remoteapp-3 && npm start    # builds then previews on :5253
cd vite-remoteapp-4 && npm start    # builds then previews on :5254
```

**Webpack remotes** run a dev server directly:

```sh
cd webpack-remoteapp-1 && npm start   # dev server on :5161
cd webpack-remoteapp-2 && npm run dev # dev server on :5162
```

**Angular remote** uses Angular CLI dev server:

```sh
cd angular-remoteapp && npm start     # ng serve on :4201
```

### Step 2 — Start the host app

```sh
cd vite-hostapp && npm run dev        # :5150
```

The host loads all remote apps from the ports above. Make sure all remotes are running before opening the host.

---

## Standalone Development

To work on any **Vite remote** in isolation without federation (full HMR):

```sh
cd vite-remoteapp-N && npm run dev
# Uses vite.dev.config.ts — runs as a normal standalone SPA
```

> `npm run dev` on Vite remotes intentionally skips federation config.
> Use `npm start` (build + preview) only when integrating with the host.

---

## Tech Stack

| Layer           | Technology                                                            |
| --------------- | --------------------------------------------------------------------- |
| Host            | Vue 3, Vue Router, Pinia, PrimeVue 4, Tailwind CSS v4                 |
| Vite remotes    | React 19, Vue 3, Svelte 5, SolidJS — each with Tailwind CSS v4        |
| Webpack remotes | React 19 (webpack-1), Vue 3 (webpack-2) — Webpack 5 Module Federation |
| Angular remote  | Angular 20, Angular Elements, PrimeNG 20, PrimeFlex                   |
| Bundlers        | Vite 7, Webpack 5, Angular CLI (esbuild)                              |
| Federation      | `@originjs/vite-plugin-federation`, Webpack `ModuleFederationPlugin`  |
| Language        | TypeScript throughout                                                 |

---

## Notes

- Each remote app has its own README (coming soon) with framework-specific setup details.
- The Angular remote uses a different embedding strategy (Web Components) compared to the
  Vite/Webpack remotes (Module Federation) — see `angular-remoteapp/README.md` for details.
