import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div style="min-height: 100vh; background: #f8fafc;">
      <header
        style="background: #2563eb; color: white; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;"
      >
        <h1 style="margin: 0; font-size: 1.4rem; font-weight: 700;">Angular Remote App</h1>
        <nav style="display: flex; gap: 0.5rem;">
          <a
            routerLink="/"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: true }"
            style="padding: 0.4rem 1rem; border-radius: 6px; color: white; text-decoration: none;"
            >Home</a
          >
          <a
            routerLink="/sub-page1"
            routerLinkActive="active-link"
            style="padding: 0.4rem 1rem; border-radius: 6px; color: white; text-decoration: none;"
            >Sub Page 1</a
          >
          <a
            routerLink="/sub-page2"
            routerLinkActive="active-link"
            style="padding: 0.4rem 1rem; border-radius: 6px; color: white; text-decoration: none;"
            >Sub Page 2</a
          >
        </nav>
      </header>
      <main style="padding: 2rem;">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .active-link {
        background: #1d4ed8;
      }
    `,
  ],
})
export class App {}
