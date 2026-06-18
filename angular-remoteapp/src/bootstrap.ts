import 'zone.js';
import { createApplication } from '@angular/platform-browser';
import { createComponent } from '@angular/core';
import { Router, UrlHandlingStrategy, UrlTree } from '@angular/router';
import { LocationStrategy, APP_BASE_HREF } from '@angular/common';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// A LocationStrategy that never reads or writes window.location/history.
// Angular's router does all its internal work but the browser URL bar
// is owned exclusively by the host (Vue Router).
class SilentLocationStrategy extends LocationStrategy {
  private _callbacks: Array<(value: any, pop?: any) => void> = [];
  private _internalPath = '/';

  override path(): string {
    return this._internalPath;
  }
  override prepareExternalUrl(internal: string): string {
    return internal;
  }

  override pushState(_state: any, _title: string, url: string, _queryParams: string) {
    this._internalPath = url;
  }

  override replaceState(_state: any, _title: string, url: string, _queryParams: string) {
    this._internalPath = url;
  }

  override forward(): void {}
  override back(): void {}
  override historyGo(_relativePosition: number): void {}

  override onPopState(fn: (value: any) => void): void {
    this._callbacks.push(fn);
  }

  override getBaseHref(): string {
    return '/';
  }

  override getState(): unknown {
    return null;
  }
}

export async function mount(container: HTMLElement, options?: { basename?: string }) {
  const app = await createApplication({
    providers: [
      ...appConfig.providers,
      { provide: APP_BASE_HREF, useValue: '/' },
      { provide: LocationStrategy, useClass: SilentLocationStrategy },
    ],
  });

  const componentRef = createComponent(App, {
    environmentInjector: app.injector,
    hostElement: container,
  });

  app.attachView(componentRef.hostView);

  const router = app.injector.get(Router);
  await router.navigateByUrl('/');

  return {
    destroy: () => {
      componentRef.destroy();
      app.destroy();
    },
  };
}

export default App;
