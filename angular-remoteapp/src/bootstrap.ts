import { createApplication } from '@angular/platform-browser';
import { createComponent, ApplicationRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { filter } from 'rxjs/operators';

export async function mount(container: HTMLElement) {
  const appRef = await createApplication(appConfig);

  const componentRef = createComponent(App, {
    environmentInjector: appRef.injector,
    hostElement: container,
  });

  appRef.attachView(componentRef.hostView);

  const router = appRef.injector.get(Router);

  // Subscribe to NavigationEnd events only (not all router events)
  // This prevents triggering on NavigationStart which causes loops
  router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
    appRef.tick();
  });

  // Initialize the router - this is CRITICAL
  // Use the 'disabled' option temporarily during setup
  const navigationPromise = router.initialNavigation();

  // Trigger initial render after navigation starts
  // Use setTimeout to break out of current execution context
  setTimeout(() => {
    appRef.tick();
  }, 0);

  return {
    destroy: () => {
      appRef.destroy();
    },
  };
}
