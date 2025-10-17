// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('angular-remoteapp');
// }

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-blue-600 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <nav class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Angular Remote App</h1>
            <div class="flex gap-4">
              <a
                routerLink="/"
                routerLinkActive="bg-blue-800"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Home
              </a>
              <a
                routerLink="/sub-page1"
                routerLinkActive="bg-blue-800"
                class="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Sub Page 1
              </a>
              <a
                routerLink="/sub-page2"
                routerLinkActive="bg-blue-800"
                class="px-4 py-2 hover:bg-blue-700 rounded transition"
              >
                Sub Page 2
              </a>
            </div>
          </nav>
        </div>
      </header>
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class App {}
