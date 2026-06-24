import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-page2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-3xl font-bold mb-4">PrimeFlex Layout</h2>

      <div class="grid mb-4">
        <div class="col-12 md:col-4" *ngFor="let stat of stats">
          <div class="surface-card border-round-xl shadow-2 p-4 text-center">
            <div class="text-4xl mb-2">{{ stat.icon }}</div>
            <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
            <div class="text-color-secondary text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="flex flex-column gap-3">
        <div
          class="flex align-items-center gap-3 surface-card border-round-lg p-3 shadow-1"
          *ngFor="let item of features"
        >
          <span class="text-2xl">{{ item.icon }}</span>
          <div>
            <div class="font-semibold">{{ item.title }}</div>
            <div class="text-color-secondary text-sm">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SubPage2Component {
  stats = [
    { icon: '🚀', value: '20.x', label: 'Angular Version' },
    { icon: '🎯', value: '80+', label: 'PrimeNG Components' },
    { icon: '📦', value: '3', label: 'CSS Frameworks Tested' },
  ];

  features = [
    {
      icon: '✅',
      title: 'Style Isolation',
      desc: 'Angular styles isolated via Shadow DOM in the Vue host',
    },
    { icon: '✅', title: 'Sub-routing', desc: 'Angular Router works inside the custom element' },
    {
      icon: '✅',
      title: 'PrimeFlex Grid',
      desc: 'Responsive grid layout using PrimeFlex utilities',
    },
    { icon: '✅', title: 'No Reload Loop', desc: 'HMR and liveReload disabled — stable embedding' },
  ];
}
