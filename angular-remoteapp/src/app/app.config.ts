import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig, withNavigationErrorHandler } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'ignore' }),
      withNavigationErrorHandler((e) => console.warn('[Angular Router]', e)),
    ),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
};
