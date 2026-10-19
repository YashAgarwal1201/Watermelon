import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="ng-app-container">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="header-inner">
          <!-- Brand / Title -->
          <div class="brand-row">
            <a routerLink="/overview" class="brand-link">
              <div class="brand-logo-wrapper">
                <svg width="28" height="28" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031"/>
                  <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2" fill="#C3002F"/>
                  <path d="M125,52.1L66.8,182.6H89.5L101.4,153.4H148.5L160.4,182.6H183.2L125,52.1ZM140.7,134.8H109.3L125,96.8L140.7,134.8Z" fill="white"/>
                </svg>
              </div>
              <div class="brand-text">
                <span class="brand-title">Angular <span class="highlight">20</span> Cheat Sheet</span>
                <span class="brand-subtitle">Modern Developer Reference</span>
              </div>
            </a>
            <span class="version-pill">v20 Reference</span>
          </div>

          <!-- Category Navigation Pills -->
          <nav class="nav-links" aria-label="Cheat Sheet Categories">
            <a
              routerLink="/overview"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-tab"
            >
              <span>Overview</span>
            </a>
            <a
              routerLink="/control-flow"
              routerLinkActive="active"
              class="nav-tab"
            >
              <span>Control Flow</span>
            </a>
            <a
              routerLink="/signals"
              routerLinkActive="active"
              class="nav-tab"
            >
              <span>Signals</span>
            </a>
            <a
              routerLink="/components"
              routerLinkActive="active"
              class="nav-tab"
            >
              <span>Component I/O</span>
            </a>
            <a
              routerLink="/templates"
              routerLinkActive="active"
              class="nav-tab"
            >
              <span>Templates</span>
            </a>
            <a
              routerLink="/di"
              routerLinkActive="active"
              class="nav-tab"
            >
              <span>DI & Guards</span>
            </a>
          </nav>
        </div>

        <!-- Sub-Header / Status Bar -->
        <div class="status-bar">
          <div class="status-left">
            <span class="route-label">Route:</span>
            <code class="route-value">{{ currentRoute() }}</code>
          </div>
          <div class="status-right">
            <span class="status-tag">
              <span class="status-dot"></span>
              Zoneless Ready
            </span>
            <span class="status-tag">
              <span class="status-dot"></span>
              Angular 17-20 Compiler
            </span>
          </div>
        </div>
      </header>

      <!-- Main Outlet Container -->
      <main class="app-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        min-height: 100vh;
        background-color: #090d16;
        color: #f8fafc;
        box-sizing: border-box;
      }

      .ng-app-container {
        width: 100%;
        min-height: 100vh;
        background-color: #090d16;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }

      /* Header */
      .app-header {
        background-color: #0b1120;
        border-bottom: 1px solid #1e293b;
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(8px);
      }

      .header-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      /* Brand */
      .brand-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .brand-link {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        text-decoration: none;
        color: inherit;
      }

      .brand-logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
      }

      .brand-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #f8fafc;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      .brand-title .highlight {
        color: #dd0031;
      }

      .brand-subtitle {
        font-size: 0.72rem;
        color: #94a3b8;
        font-weight: 500;
      }

      .version-pill {
        font-size: 0.68rem;
        font-weight: 600;
        background: rgba(221, 0, 49, 0.15);
        color: #f43f5e;
        border: 1px solid rgba(221, 0, 49, 0.3);
        padding: 0.15rem 0.5rem;
        border-radius: 9999px;
        letter-spacing: 0.02em;
      }

      /* Navigation Tabs */
      .nav-links {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        overflow-x: auto;
        padding: 0.2rem 0;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .nav-links::-webkit-scrollbar {
        display: none;
      }

      .nav-tab {
        display: inline-flex;
        align-items: center;
        padding: 0.45rem 0.8rem;
        border-radius: 6px;
        font-size: 0.82rem;
        font-weight: 500;
        color: #94a3b8;
        text-decoration: none;
        white-space: nowrap;
        transition: all 0.15s ease;
        border: 1px solid transparent;
      }

      .nav-tab:hover {
        background: #1e293b;
        color: #f8fafc;
      }

      .nav-tab.active {
        background: #dd0031;
        color: #ffffff;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(221, 0, 49, 0.35);
      }

      /* Status Bar */
      .status-bar {
        background-color: #070a12;
        border-top: 1px solid #131d2e;
        padding: 0.35rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.72rem;
        color: #64748b;
        max-width: 100%;
        overflow-x: auto;
      }

      .status-left {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        white-space: nowrap;
      }

      .route-label {
        color: #64748b;
      }

      .route-value {
        color: #38bdf8;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        background: rgba(56, 189, 248, 0.1);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
      }

      .status-right {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        white-space: nowrap;
      }

      .status-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        color: #94a3b8;
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
      }

      /* Main container */
      .app-main {
        flex: 1;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.25rem 1rem 3rem 1rem;
        box-sizing: border-box;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .header-inner {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
        }

        .brand-row {
          width: 100%;
          justify-content: space-between;
        }

        .nav-links {
          width: 100%;
          gap: 0.3rem;
          padding-bottom: 0.25rem;
        }

        .nav-tab {
          padding: 0.4rem 0.7rem;
          font-size: 0.78rem;
        }

        .status-bar {
          padding: 0.35rem 0.75rem;
        }

        .status-right {
          display: none;
        }

        .app-main {
          padding: 1rem 0.5rem 2rem 0.5rem;
        }
      }
    `,
  ],
})
export class App {
  private router = inject(Router);

  private navEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event) => event.urlAfterRedirects || event.url)
  );

  currentRoute = toSignal(this.navEnd$, { initialValue: this.router.url || '/overview' });
}
