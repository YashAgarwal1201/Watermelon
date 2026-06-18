import 'zone.js';
import('./bootstrap')
  .then((m) => {
    const container = document.querySelector('app-root');
    if (container) m.mount(container as HTMLElement);
  })
  .catch((err) => console.error(err));
