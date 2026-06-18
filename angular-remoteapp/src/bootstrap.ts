import { createApplication } from '@angular/platform-browser';
import { createComponent, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy, APP_BASE_HREF } from '@angular/common';
import { appConfig } from './app/app.config';
import { App } from './app/app';

class SilentLocationStrategy extends LocationStrategy {
  private _callbacks: Array<(value: any, pop?: any) => void> = [];
  private _internalPath = '/';
  override path(): string {
    return this._internalPath;
  }
  override prepareExternalUrl(i: string): string {
    return i;
  }
  override pushState(_s: any, _t: string, url: string, _q: string) {
    this._internalPath = url;
  }
  override replaceState(_s: any, _t: string, url: string, _q: string) {
    this._internalPath = url;
  }
  override forward(): void {}
  override back(): void {}
  override historyGo(_n: number): void {}
  override onPopState(fn: (v: any) => void): void {
    this._callbacks.push(fn);
  }
  override getBaseHref(): string {
    return '/';
  }
  override getState(): unknown {
    return null;
  }
}

export async function mount(
  container: HTMLElement,
  options?: { basename?: string; embedded?: boolean },
) {
  const isEmbedded = options?.embedded === true;

  const app = await createApplication({
    providers: [
      ...appConfig.providers,
      { provide: APP_BASE_HREF, useValue: '/' },
      ...(isEmbedded ? [{ provide: LocationStrategy, useClass: SilentLocationStrategy }] : []),
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
