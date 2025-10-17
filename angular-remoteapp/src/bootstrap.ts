// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { App } from './app/app';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));

// import { createApplication } from '@angular/platform-browser';
// import { createComponent, Component, ApplicationRef } from '@angular/core';
// import { RouterOutlet, Router } from '@angular/router';
// import { appConfig } from './app/app.config';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet],
//   template: '<router-outlet></router-outlet>',
// })
// class RootComponent {}

// export async function mount(container: HTMLElement) {
//   const app = await createApplication(appConfig);
//   const componentRef = createComponent(RootComponent, {
//     environmentInjector: app.injector,
//     hostElement: container,
//   });

//   app.attachView(componentRef.hostView);

//   // Get ApplicationRef and Router
//   const appRef = app.injector.get(ApplicationRef);
//   const router = app.injector.get(Router);

//   // Wait for router to initialize and navigate, then tick
//   await router.initialNavigation();
//   appRef.tick();

//   // Set up continuous change detection for zoneless
//   const interval = setInterval(() => appRef.tick(), 100);

//   return {
//     destroy: () => {
//       clearInterval(interval);
//       app.destroy();
//     },
//   };
// }

// export default RootComponent;

import { createApplication } from '@angular/platform-browser';
import { createComponent, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { appConfig } from './app/app.config';
import { App } from './app/app';

export async function mount(container: HTMLElement, options?: { basename?: string }) {
  const basename = options?.basename || (window as any).BASENAME || '/';

  const app = await createApplication({
    providers: [...appConfig.providers, { provide: APP_BASE_HREF, useValue: basename }],
  });

  const componentRef = createComponent(App, {
    environmentInjector: app.injector,
    hostElement: container,
  });

  app.attachView(componentRef.hostView);

  const appRef = app.injector.get(ApplicationRef);
  const router = app.injector.get(Router);

  await router.initialNavigation();
  appRef.tick();

  return {
    destroy: () => {
      componentRef.destroy();
      app.destroy();
    },
  };
}

export default App;
