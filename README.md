# Watermelon (Vite Microfrontend Architecture with Module Federation)

This demonstrates a microfrontend setup using [Vite](https://vitejs.dev/), [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation), and multiple frameworks: **Vue (host and remote)**, **React**, **Svelte**, and **SolidJS**.

## Project Structure

```
root/
├─ vite-hostapp/             # Vue 3-based host application
├─ vite-remoteapp-1/         # React-based remote app
├─ vite-remoteapp-2/         # Vue-based remote app
├─ vite-remoteapp-3/         # Svelte-based remote app
├─ vite-remoteapp-4/         # SolidJS-based remote app
...
```

---

## Usage

### 1. **Module Federation Mode (for Host + Remotes integration)**

This mode is for when you want to run the full microfrontend architecture — the host loads remote apps' modules via module federation.  
**Remotes must be run in build/preview mode so the host can fetch the `remoteEntry.js` files.**

**For each remote app (React, Vue, Svelte, SolidJS):**

```sh
cd vite-remoteapp-N
npm install
npm run build
npm run preview
# The default preview port is usually 4173, but check your config/terminal for the correct port
```

**Note:** Make sure each remote is previewing on the port specified in your host's federation config.

**For the host app (Vue-based):**

```sh
cd vite-hostapp
npm install
npm run dev
# The host will fetch remote modules from the preview servers.
```

---

### 2. **Standalone Development Mode (for working on an individual remote app)**

If you want to work on any remote app as a regular standalone SPA, launch it with a special config that disables federation.

**For any remote app:**

```sh
cd vite-remoteapp-N
npm install
npm run dev
# This uses vite --config vite.dev.config.ts and loads the app as standalone.
```

- This enables fast HMR and regular SPA behavior for isolated development.
- You can access the app at the port specified in config.

---

## Scripts Explained

- **`npm run dev`**: Runs the app in standalone mode for individual development using `vite --config vite.dev.config.ts`
- **`npm run build`**: Builds the remote/host for preview or production
- **`npm run preview`**: Serves the built app (remotes must use this for federation!)

---

## Federation Configs

- Remote apps: Main federation config is in `vite.config.ts` (for build/preview/federation usage).
- Standalone mode: Uses `vite.dev.config.ts` to run as a normal SPA, with no federation.
- Host app: Federation config in `vite.config.ts` uses remote URLs matching your remotes' preview ports.

---

## Example Workflow

1. Start all remote apps in preview mode:

   - `cd vite-remoteapp-1 && npm run build && npm run preview`
   - `cd vite-remoteapp-2 && npm run build && npm run preview`
   - ...repeat for other remotes

2. Start host app:

   - `cd vite-hostapp && npm run dev`

3. The host loads remote components from the running preview servers.

---

## Notes

- **Never use `npm run dev` for remotes during federation.**  
  The host requires the `remoteEntry.js` asset, which is only served in preview mode after build.
- **Use `npm run dev` only for local, standalone development/testing on a single remote app.**
- **Each app can be further customized—refer to its README or configs for framework-specific notes (Coming soon).**

---

## Credits

- Built with [Vite](https://vitejs.dev/) and [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation).
- Example covers federated microfrontends in React, Vue, Svelte, and SolidJS.

---
