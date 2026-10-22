# angular-remoteapp : Angular 20 Interactive Cheat Sheet

An interactive, responsive developer reference application and microfrontend built with **Angular 20**, **Angular Elements**, **PrimeNG 20** (Aura theme), and **PrimeFlex**, packaged as a standard W3C Custom Element (`<angular-remote-app>`).

---

## Architecture & Features

This application serves as a comprehensive **interactive cheat sheet** for modern Angular features with live playgrounds, code blocks with clipboard copying, and deeply nested sub-routes:

### 1. Control Flow & Templates (`/components/control-flow`)
- `&#64;if` / `&#64;else if` / `&#64;else` compiler-native conditional logic
- `&#64;for` with mandatory `track` expression and `&#64;empty` fallback state
- `&#64;switch` / `&#64;case` strict equality type-safe status machine
- `&#64;let` in-template scoped variable declarations and calculation caching (Angular 18.1+)

### 2. Signal-Based Components (`/components/inputs-outputs`)
- `input()` & `input.required()` functional reactive props
- `output()` lightweight event emission replacing `@Output() EventEmitter`
- `model()` two-way signal synchronization with "banana-in-a-box" syntax

### 3. Templates & Lifecycle (`/components/templates`, `/components/lifecycle`)
- `&#64;defer` declarative lazy-loading triggered on idle, viewport, interaction, timer, or conditions
- `<ng-content select="...">` multi-slot content projection
- `DestroyRef` and `afterNextRender` modern functional lifecycle primitives

### 4. Signals & Reactivity (`/signals`)
- **Core Primitives (`/signals/basics`)**: `signal()`, `computed()`, `effect()`
- **Advanced State (`/signals/advanced`)**: `linkedSignal()` (v19+) for source-resetting writable signals, `resource()` (v19/20) for declarative async data fetching
- **RxJS Interoperability (`/signals/rxjs-interop`)**: `toSignal()` and `toObservable()`

### 5. Dependency Injection & Architecture (`/di`)
- `inject()` function eliminating constructor ceremony and enabling custom composables
- Functional routing guards (`CanActivateFn`, `ResolveFn`)

---

## Integration Strategy

Unlike the Vite and Webpack remotes that use Module Federation, the Angular remote uses **Angular Elements**:

1. **Custom Element Registration**:
   The Angular application uses `createCustomElement` from `@angular/elements` to define a custom element:
   ```typescript
   customElements.define('angular-remote-app', el);
   ```

2. **Host Consumption**:
   The Vue 3 host shell dynamically loads the Angular script bundle (`https://localhost:4201/main.js`) and mounts it as a native HTML custom element:
   ```html
   <angular-remote-app></angular-remote-app>
   ```
   This ensures complete framework isolation, zone encapsulation, and independent lifecycle management.

---

## Ports & Scripts

| Command | Description | Port |
| :--- | :--- | :---: |
| `npm start` | Runs Angular CLI development server with HTTPS (mkcert) | `4201` |
| `npm run build` | Compiles production bundle with budget verification | N/A |
| `npm run watch` | Builds and watches for changes in development mode | N/A |
| `npm run test` | Runs unit tests using Karma | N/A |
