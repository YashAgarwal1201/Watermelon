import 'zone.js';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { appConfig } from './app/app.config';
import { App } from './app/app';

createApplication({
  providers: [
    ...appConfig.providers,
    {
      provide: APP_BASE_HREF,
      useValue: (window as any).BASENAME || '/',
    },
  ],
})
  .then((appRef) => {
    const router = appRef.injector.get(Router);
    const el = createCustomElement(App, { injector: appRef.injector });
    customElements.define('angular-remote-app', el);

    customElements.whenDefined('angular-remote-app').then(() => {
      const basename = (window as any).BASENAME || '';
      const relativePath = window.location.pathname.replace(basename, '') || '/';
      router.navigateByUrl(relativePath);
    });
  })
  .catch((err) => console.error(err));
