import 'zone.js';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { appConfig } from './app/app.config';
import { App } from './app/app';

createApplication(appConfig)
  .then((appRef) => {
    const el = createCustomElement(App, { injector: appRef.injector });
    customElements.define('angular-remote-app', el);
  })
  .catch((err) => console.error(err));
