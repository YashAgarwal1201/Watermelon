import { createApplication } from '@angular/platform-browser';
import { createComponent } from '@angular/core';
import { RemoteWrapper } from './remote-wrapper/remote-wrapper';
import { appConfig } from './app.config';

export async function mount(container: HTMLElement) {
  // Create the application
  const appRef = await createApplication(appConfig);

  // Create the component programmatically (no selector needed)
  const componentRef = createComponent(RemoteWrapper, {
    environmentInjector: appRef.injector,
    hostElement: container, // Mount directly to the container
  });

  // Attach the component to the application
  appRef.attachView(componentRef.hostView);

  return {
    destroy: () => {
      appRef.destroy();
    },
  };
}

export default RemoteWrapper;
