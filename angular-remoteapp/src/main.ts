// Only bootstrap standalone when running as its own app, not as a remote
if (document.querySelector('app-root')) {
  import('zone.js').then(() => {
    import('./bootstrap').then((m) => {
      const container = document.querySelector('app-root');
      if (container) m.mount(container as HTMLElement);
    });
  });
}
