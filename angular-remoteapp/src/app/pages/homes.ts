import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h2 class="home-title">Welcome to Angular Remote App</h2>
      <p class="home-desc">
        This page uses plain CSS only. Navigate using the tabs above to test PrimeNG and PrimeFlex
        pages.
      </p>
      <div class="card-grid">
        <div class="card" *ngFor="let item of items">
          <span class="card-icon">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 2rem;
      }
      .home-title {
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #1e293b;
      }
      .home-desc {
        color: #64748b;
        margin-bottom: 2rem;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.5rem;
      }
      .card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .card-icon {
        font-size: 2.5rem;
      }
      .card h3 {
        margin: 0.75rem 0 0.25rem;
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
      }
      .card p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
      }
    `,
  ],
})
export class HomeComponent {
  items = [
    { icon: '🅰️', title: 'Angular 20', desc: 'Standalone components, zoneless ready' },
    { icon: '🎨', title: 'PrimeNG', desc: 'Rich UI components with Aura theme' },
    { icon: '📐', title: 'PrimeFlex', desc: 'Utility CSS for responsive layouts' },
    { icon: '🔗', title: 'Web Components', desc: 'Embedded via Angular Elements' },
  ];
}
