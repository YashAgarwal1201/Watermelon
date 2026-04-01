// File: types/remote.d.ts

// declare module "vite_react_remoteapp/RemoteComponent" {
//   const Component: React.ComponentType;
//   export default Component;
// }

declare module "vite_vue_remoteapp/ViteVueRemoteComponent";
declare module "vite_react_remoteapp/ViteReactRemoteComponent";
declare module "vite_svelte_remoteapp/ViteSvelteRemoteComponent";
declare module "vite_solidjs_remoteapp/ViteSolidRemoteComponent";
declare module "webpack_react_remoteapp/WebpackReactRemoteComponent";
declare module "webpack_vue_remoteapp/WebpackVueRemoteComponent";
declare module "angular_remoteapp/Component" {
  export function mount(container: HTMLElement): Promise<{
    destroy: () => void;
  }>;
}
