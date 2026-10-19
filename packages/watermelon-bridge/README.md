# @watermelon/bridge

A framework-agnostic, typesafe, bidirectional `postMessage` communication protocol designed for iframe-based microfrontends.

---

## 1. Overview & Purpose

In microfrontend architectures, iframes provide strong boundaries:
- **Crash Isolation**: An unhandled runtime error inside an iframe cannot crash the host shell.
- **Fullstack SSR Integration**: Frameworks like Next.js App Router, Nuxt, and SvelteKit rely on server components and server actions that cannot run through client-side Module Federation.
- **Strict Storage & Cookie Separation**: Independent browser contexts prevent storage and token collisions.

However, iframes introduce isolation challenges:
1. They require explicit parent-child communication.
2. They do not naturally adjust their height to inner document content, causing double scrollbars.
3. Uncoordinated routing leaves host and remote URLs out of sync.
4. Themes, authentication tokens, and user settings must cross the iframe boundary.

`@watermelon/bridge` solves these challenges through a standardized, typed postMessage protocol.

---

## 2. Protocol Specification

### 2.1 Namespace Guard

Every message exchanged across the bridge includes an envelope with a namespace guard:

```typescript
export interface WatermelonMessage<T = unknown> {
  __wm: true;             // Namespace guard: filters out 3rd-party/extension postMessages
  type: WatermelonMessageType;
  remoteId: string;       // Target or source remote ID (e.g., 'iframe_vite_app')
  payload: T;
  timestamp: number;      // Epoch ms timestamp
}
```

Any message received that lacks `__wm: true` or does not match the active `remoteId` is ignored.

---

### 2.2 Message Taxonomy

| Direction | Type | Payload | Description |
| :--- | :--- | :--- | :--- |
| **Remote → Host** | `WM_READY` | `{}` | Emitted when remote component mounts and initializes bridge. |
| **Remote → Host** | `WM_RESIZE` | `{ height: number }` | Remote body height change; host resizes `<iframe>` element. |
| **Remote → Host** | `WM_NAVIGATE` | `{ path: string }` | Remote internal router changed route; host synchronizes shell. |
| **Remote → Host** | `WM_ERROR` | `{ message, stack? }` | Unhandled error in remote; host activates error boundary. |
| **Remote → Host** | `WM_EVENT` | `{ eventType, detail }`| Semantic domain event (e.g. `ASSET_SELECTED`). |
| **Host → Remote** | `WM_THEME` | `{ theme: 'light' \| 'dark' }` | Host theme mode update; remote updates styling/CSS tokens. |
| **Host → Remote** | `WM_AUTH` | `{ token?, userId?, ... }` | Host session/authentication context. |
| **Host → Remote** | `WM_NAVIGATE_TO` | `{ path: string }` | Host requests remote internal router to navigate. |
| **Host → Remote** | `WM_PING` | `{}` | Host checks if remote content window is alive. |

---

## 3. Host Usage (`WatermelonBridgeHost`)

Used inside the host application (such as in `RemoteWrapper/adapters/IframeAdapter.ts`):

```typescript
import { WatermelonBridgeHost } from '@watermelon/bridge';

const bridge = new WatermelonBridgeHost({
  remoteId: 'iframe_nextjs_app',
  iframe: iframeElement,
  targetOrigin: 'https://localhost:5301', // or '*'
  onReady: () => {
    console.log('Remote ready');
    // Send current host theme on initial connection
    bridge.sendTheme(isDark ? 'dark' : 'light');
  },
  onResize: (height) => {
    // Dynamically adjust iframe height to eliminate inner scrollbars
    iframeElement.style.height = `${height}px`;
  },
  onNavigate: (path) => {
    console.log('Remote navigated internally to:', path);
  },
  onError: (err) => {
    console.error('Remote error:', err.message);
  },
  onEvent: (type, payload) => {
    if (type === 'ASSET_SELECTED') {
      console.log('Selected asset:', payload);
    }
  },
});

// Broadcast changes
bridge.sendTheme('dark');
bridge.sendAuth({ token: 'jwt_...', userId: 'usr_123' });
bridge.navigateTo('/dashboard/settings');

// Teardown on unmount
bridge.destroy();
```

---

## 4. Remote Client Usage (`WatermelonBridgeClient`)

Used inside any remote iframe (Next.js client component, Vite React, Vue, Svelte, or vanilla JS):

```typescript
import { WatermelonBridgeClient } from '@watermelon/bridge';

const bridge = new WatermelonBridgeClient({
  remoteId: 'iframe_nextjs_app',
});

// 1. Signal ready state to host
bridge.ready();

// 2. Automatically sync height with ResizeObserver
const cleanupObserver = bridge.observeResize(document.body);

// 3. Listen to host theme changes
const unsubscribeTheme = bridge.onTheme((theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// 4. Emit custom domain events to host
button.addEventListener('click', () => {
  bridge.emit('ASSET_SELECTED', { id: 'file_42', name: 'image.png' });
});

// Teardown when component unmounts
window.addEventListener('beforeunload', () => {
  cleanupObserver();
  unsubscribeTheme();
  bridge.destroy();
});
```

---

## 5. Security & CSP Guidelines

When embedding iframes, ensure production headers permit framing:

### Content Security Policy (CSP)
In `next.config.ts` or Vite HTTP headers:
```http
Content-Security-Policy: frame-ancestors 'self' https://localhost:5150
```
*(Avoid `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN` as they prevent cross-origin embedding).*
