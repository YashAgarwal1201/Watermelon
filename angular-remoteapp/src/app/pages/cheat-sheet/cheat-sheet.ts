import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CodeSnippetComponent } from '../../components/code-snippet/code-snippet';

export interface CheatItem {
  id: string;
  title: string;
  category: 'Control Flow' | 'Signals' | 'Component I/O' | 'Templates' | 'Dependency Injection';
  version: string;
  summary: string;
  code: string;
  codeTitle: string;
  legacyVsModern?: { legacy: string; modern: string };
  proTip?: string;
  tags: string[];
}

@Component({
  selector: 'app-cheat-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, CodeSnippetComponent],
  template: `
    <div class="cheatsheet-wrapper">
      <!-- Search & Category Filters Bar -->
      <section class="controls-section">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
          </svg>
          <input
            type="search"
            class="search-input"
            placeholder="Search cheats (e.g. @if, track, signal, defer, model, inject)..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
          <button
            *ngIf="searchQuery()"
            type="button"
            class="clear-search-btn"
            (click)="searchQuery.set('')"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>

        <!-- Category Filter Pills -->
        <div class="categories-bar">
          <button
            *ngFor="let cat of categories"
            type="button"
            class="category-pill"
            [class.active]="selectedCategory() === cat"
            (click)="selectedCategory.set(cat)"
          >
            {{ cat }}
            <span class="count-badge">{{ getCountForCategory(cat) }}</span>
          </button>
        </div>
      </section>

      <!-- Active Filter Status -->
      <div class="results-header">
        <span class="results-count">
          Showing <strong>{{ filteredCheats().length }}</strong> of {{ allCheats.length }} cheat sheet references
        </span>
        <button
          *ngIf="searchQuery() || selectedCategory() !== 'All'"
          type="button"
          class="reset-filters-btn"
          (click)="resetFilters()"
        >
          Reset Filters
        </button>
      </div>

      <!-- Cheats Grid -->
      <div class="cheats-grid">
        <article *ngFor="let item of filteredCheats(); trackBy: trackById" class="cheat-card">
          <!-- Card Header -->
          <div class="cheat-card-header">
            <div class="cheat-title-row">
              <h2 class="cheat-title">{{ item.title }}</h2>
              <span class="version-tag">{{ item.version }}</span>
            </div>
            <div class="category-tag">{{ item.category }}</div>
            <p class="cheat-summary">{{ item.summary }}</p>
          </div>

          <!-- Code Snippet -->
          <div class="cheat-code-container">
            <app-code-snippet [title]="item.codeTitle" [code]="item.code" />
          </div>

          <!-- Legacy vs Modern Comparison (if applicable) -->
          <div *ngIf="item.legacyVsModern" class="comparison-box">
            <div class="compare-col modern">
              <span class="compare-badge modern-badge">✓ Modern Syntax</span>
              <pre class="compare-code"><code>{{ item.legacyVsModern.modern }}</code></pre>
            </div>
            <div class="compare-col legacy">
              <span class="compare-badge legacy-badge">✕ Legacy (*ngIf/directive)</span>
              <pre class="compare-code"><code>{{ item.legacyVsModern.legacy }}</code></pre>
            </div>
          </div>

          <!-- Pro Tip / Gotcha -->
          <div *ngIf="item.proTip" class="protip-box">
            <div class="protip-header">
              <svg class="protip-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6c0 1.887.87 3.57 2.235 4.665.41.33.68.8.765 1.335h6c.085-.535.355-1.005.765-1.335A5.986 5.986 0 0016 8a6 6 0 00-6-6zm-1.5 13.5v.75a.75.75 0 001.5 0v-.75h-1.5zm-1 2.25v.5a.75.75 0 001.5 0v-.5H7.5zm3.5 0v.5a.75.75 0 001.5 0v-.5H11z" />
              </svg>
              <span>Developer Tip</span>
            </div>
            <p class="protip-text">{{ item.proTip }}</p>
          </div>
        </article>

        <!-- Empty State -->
        <div *ngIf="filteredCheats().length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No cheats found</h3>
          <p class="empty-desc">
            No items matched "<strong>{{ searchQuery() }}</strong>". Try searching for <code>signal</code>, <code>for</code>, <code>defer</code>, or <code>inject</code>.
          </p>
          <button type="button" class="empty-reset-btn" (click)="resetFilters()">
            Show All Cheats
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        color: #f8fafc;
      }

      .cheatsheet-wrapper {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      /* Controls: Search + Categories */
      .controls-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
      }

      .search-box {
        position: relative;
        width: 100%;
      }

      .search-icon {
        position: absolute;
        left: 0.85rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1.1rem;
        height: 1.1rem;
        color: #64748b;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.7rem 2.25rem 0.7rem 2.45rem;
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 8px;
        color: #f8fafc;
        font-size: 0.92rem;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }

      @media (max-width: 640px) {
        .search-input {
          font-size: 16px; /* Prevents auto-zoom on iOS */
        }
      }

      .search-input:focus {
        border-color: #dd0031;
        box-shadow: 0 0 0 2px rgba(221, 0, 49, 0.2);
      }

      .search-input::placeholder {
        color: #64748b;
      }

      .clear-search-btn {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.4rem;
        min-width: 36px;
        min-height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .clear-search-btn:hover {
        color: #ffffff;
      }

      /* Categories Bar */
      .categories-bar {
        display: flex;
        gap: 0.45rem;
        overflow-x: auto;
        padding: 0.2rem 0 0.4rem 0;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .categories-bar::-webkit-scrollbar {
        display: none;
      }

      .category-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 0.9rem;
        min-height: 38px;
        background: #0f172a;
        color: #94a3b8;
        border: 1px solid #1e293b;
        border-radius: 9999px;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
        flex-shrink: 0;
        touch-action: manipulation;
      }

      .category-pill:hover {
        background: #1e293b;
        color: #f8fafc;
        border-color: #334155;
      }

      .category-pill.active {
        background: #dd0031;
        color: #ffffff;
        border-color: #dd0031;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(221, 0, 49, 0.35);
      }

      .count-badge {
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        font-mono: true;
      }

      .category-pill.active .count-badge {
        background: rgba(0, 0, 0, 0.25);
      }

      /* Results Header */
      .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: #94a3b8;
        margin-bottom: 1rem;
        padding: 0 0.25rem;
      }

      .results-count strong {
        color: #f8fafc;
      }

      .reset-filters-btn {
        background: transparent;
        border: none;
        color: #f43f5e;
        font-size: 0.78rem;
        cursor: pointer;
        font-weight: 500;
        text-decoration: underline;
        padding: 0;
      }

      /* Cheats Grid */
      .cheats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      @media (min-width: 900px) {
        .cheats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      /* Cheat Card */
      .cheat-card {
        background: #111827;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        transition: border-color 0.2s ease, transform 0.2s ease;
      }

      @media (max-width: 640px) {
        .cheat-card {
          padding: 0.85rem;
          border-radius: 10px;
        }
      }

      .cheat-card:hover {
        border-color: #334155;
      }

      .cheat-title-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .cheat-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }

      .version-tag {
        font-size: 0.7rem;
        font-weight: 700;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.25);
        padding: 0.15rem 0.45rem;
        border-radius: 4px;
        white-space: nowrap;
      }

      .category-tag {
        font-size: 0.72rem;
        font-weight: 600;
        color: #f43f5e;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      .cheat-summary {
        font-size: 0.85rem;
        color: #cbd5e1;
        line-height: 1.45;
        margin: 0 0 0.5rem 0;
      }

      .cheat-code-container {
        margin: 0.5rem 0;
      }

      /* Comparison Box (Legacy vs Modern) */
      .comparison-box {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
        margin: 0.65rem 0;
        font-size: 0.75rem;
      }

      @media (min-width: 600px) {
        .comparison-box {
          grid-template-columns: 1fr 1fr;
        }
      }

      .compare-col {
        padding: 0.5rem 0.65rem;
        border-radius: 6px;
        border: 1px solid #1e293b;
      }

      .compare-col.modern {
        background: rgba(16, 185, 129, 0.06);
        border-color: rgba(16, 185, 129, 0.25);
      }

      .compare-col.legacy {
        background: rgba(239, 68, 68, 0.06);
        border-color: rgba(239, 68, 68, 0.2);
      }

      .compare-badge {
        font-size: 0.68rem;
        font-weight: 700;
        display: block;
        margin-bottom: 0.35rem;
      }

      .modern-badge {
        color: #34d399;
      }

      .legacy-badge {
        color: #f87171;
      }

      .compare-code {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.75rem;
        line-height: 1.4;
        color: #e2e8f0;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }

      /* ProTip Box */
      .protip-box {
        background: rgba(14, 165, 233, 0.08);
        border: 1px solid rgba(14, 165, 233, 0.25);
        border-radius: 6px;
        padding: 0.55rem 0.75rem;
        margin-top: 0.5rem;
      }

      .protip-header {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.72rem;
        font-weight: 700;
        color: #38bdf8;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 0.25rem;
      }

      .protip-icon {
        width: 0.85rem;
        height: 0.85rem;
      }

      .protip-text {
        margin: 0;
        font-size: 0.8rem;
        color: #94a3b8;
        line-height: 1.4;
      }

      /* Empty State */
      .empty-state {
        grid-column: 1 / -1;
        padding: 3rem 1rem;
        text-align: center;
        background: #111827;
        border: 1px dashed #334155;
        border-radius: 12px;
      }

      .empty-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .empty-title {
        font-size: 1.15rem;
        color: #f8fafc;
        margin: 0 0 0.5rem 0;
      }

      .empty-desc {
        font-size: 0.85rem;
        color: #94a3b8;
        max-width: 25rem;
        margin: 0 auto 1rem auto;
      }

      .empty-reset-btn {
        background: #dd0031;
        color: #ffffff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
      }
    `,
  ],
})
export class CheatSheetComponent {
  private route = inject(ActivatedRoute);

  categories: string[] = [
    'All',
    'Control Flow',
    'Signals',
    'Component I/O',
    'Templates',
    'Dependency Injection',
  ];

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');

  allCheats: CheatItem[] = [
    // ─── CONTROL FLOW ──────────────────────────────────────────────────────────
    {
      id: 'cf-if',
      title: '@if / @else if / @else',
      category: 'Control Flow',
      version: 'v17+',
      summary: 'Declarative compiler-native conditional block with zero bundle overhead. Replaces *ngIf.',
      codeTitle: 'template.html',
      code: `@if (user.isLoggedIn) {
  <app-dashboard [user]="user" />
} @else if (user.isGuest) {
  <app-guest-banner />
} @else {
  <app-login-form />
}`,
      legacyVsModern: {
        modern: `@if (user.isAdmin) {
  <app-admin />
} @else {
  <app-user />
}`,
        legacy: `<ng-container *ngIf="user.isAdmin; else guest">
  <app-admin />
</ng-container>
<ng-template #guest>
  <app-user />
</ng-template>`,
      },
      proTip: 'Control flow blocks (@if, @for, @switch) do NOT require CommonModule or NgIf imports in standalone components.',
      tags: ['if', 'else', 'conditional', 'control flow', 'ngif'],
    },
    {
      id: 'cf-for',
      title: '@for & track',
      category: 'Control Flow',
      version: 'v17+',
      summary: 'High-performance loops with mandatory tracking expression and built-in @empty fallback block.',
      codeTitle: 'template.html',
      code: `@for (item of items(); track item.id; let idx = $index, count = $count) {
  <div class="card">#{{ idx + 1 }} of {{ count }}: {{ item.name }}</div>
} @empty {
  <div class="empty-state">No items found.</div>
}`,
      legacyVsModern: {
        modern: `@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items</p>
}`,
        legacy: `<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
<p *ngIf="items.length === 0">No items</p>`,
      },
      proTip: 'The "track" expression is strictly mandatory and up to 90% faster than legacy *ngFor without trackBy.',
      tags: ['for', 'track', 'loop', 'empty', 'ngfor', 'control flow'],
    },
    {
      id: 'cf-switch',
      title: '@switch / @case',
      category: 'Control Flow',
      version: 'v17+',
      summary: 'Compiler-checked switch matching with strict equality (===) and zero fall-through errors.',
      codeTitle: 'template.html',
      code: `@switch (status()) {
  @case ('active') {
    <span class="badge success">Active</span>
  }
  @case ('pending') {
    <span class="badge warning">Pending</span>
  }
  @default {
    <span class="badge muted">Unknown</span>
  }
}`,
      proTip: 'Unlike JavaScript switch, @case does NOT require a "break;" statement : fall-through is impossible.',
      tags: ['switch', 'case', 'default', 'control flow', 'ngswitch'],
    },
    {
      id: 'cf-let',
      title: '@let Template Variables',
      category: 'Control Flow',
      version: 'v18.1+',
      summary: 'Declare local reactive template variables to avoid duplicating complex expressions or async pipes.',
      codeTitle: 'template.html',
      code: `@let user = user$ | async;
@let fullName = user?.firstName + ' ' + user?.lastName;
@let isPrivileged = user?.role === 'admin' || user?.role === 'superadmin';

@if (isPrivileged) {
  <h1>Welcome, {{ fullName }}</h1>
}`,
      proTip: '@let variables are read-only and automatically scoped to the template block in which they are declared.',
      tags: ['let', 'variables', 'async', 'template', 'control flow'],
    },

    // ─── SIGNALS ──────────────────────────────────────────────────────────────
    {
      id: 'sig-basic',
      title: 'signal()',
      category: 'Signals',
      version: 'v16+',
      summary: 'Writable reactive state primitive. Triggers zoneless, fine-grained DOM updates upon value mutation.',
      codeTitle: 'component.ts',
      code: `import { Component, signal } from '@angular/core';

@Component({ ... })
export class CounterComponent {
  count = signal<number>(0);

  increment() {
    this.count.update(val => val + 1); // Mutate based on prev
  }

  reset() {
    this.count.set(0); // Overwrite directly
  }
}`,
      proTip: 'Read the signal value by invoking it like a function: {{ count() }}. No subscription or async pipe needed.',
      tags: ['signal', 'state', 'update', 'set', 'reactivity'],
    },
    {
      id: 'sig-computed',
      title: 'computed()',
      category: 'Signals',
      version: 'v16+',
      summary: 'Pure, memoized read-only derivation. Automatically tracks signal dependencies and caches results.',
      codeTitle: 'component.ts',
      code: `import { signal, computed } from '@angular/core';

export class CartComponent {
  quantity = signal<number>(2);
  price = signal<number>(25);

  // Automatically recalculates only when quantity or price updates
  total = computed(() => this.quantity() * this.price());
  isFreeShipping = computed(() => this.total() >= 50);
}`,
      proTip: 'computed() is lazily evaluated : it only executes when read, and caches the result until dependencies change.',
      tags: ['computed', 'memoized', 'derived', 'signals', 'reactivity'],
    },
    {
      id: 'sig-effect',
      title: 'effect()',
      category: 'Signals',
      version: 'v16+',
      summary: 'Executes side-effects whenever observed signals change. Supports automatic cleanup functions.',
      codeTitle: 'component.ts',
      code: `import { effect, signal } from '@angular/core';

export class LoggerComponent {
  query = signal('');

  constructor() {
    effect((onCleanup) => {
      const q = this.query();
      const timer = setTimeout(() => console.log('Debounced:', q), 300);

      onCleanup(() => clearTimeout(timer)); // Cleanup prior run
    });
  }
}`,
      proTip: 'effect() must be instantiated within an injection context (e.g. constructor) unless injector is passed explicitly.',
      tags: ['effect', 'side effect', 'cleanup', 'signals', 'reactivity'],
    },
    {
      id: 'sig-linked',
      title: 'linkedSignal()',
      category: 'Signals',
      version: 'v19+',
      summary: 'A writable signal whose default value resets or synchronizes whenever a source signal changes.',
      codeTitle: 'component.ts',
      code: `import { signal, linkedSignal } from '@angular/core';

export class OptionsComponent {
  course = signal('Angular 20');

  // Writable, but automatically resets when course() changes:
  selectedTopic = linkedSignal({
    source: this.course,
    computation: (c) => c === 'Angular 20' ? 'Signals' : 'Basics'
  });
}`,
      proTip: 'Solves the classic state synchronization bug where child selections persist across parent ID changes.',
      tags: ['linkedSignal', 'sync', 'reset', 'signals', 'reactivity', 'v19'],
    },
    {
      id: 'sig-resource',
      title: 'resource()',
      category: 'Signals',
      version: 'v19+',
      summary: 'Asynchronous data loading primitive designed specifically for signals and zoneless change detection.',
      codeTitle: 'component.ts',
      code: `import { signal, resource } from '@angular/core';

export class UsersComponent {
  userId = signal(1);

  userResource = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request, abortSignal }) => {
      const res = await fetch(\`/api/users/\${request.id}\`, { signal: abortSignal });
      return res.json();
    }
  });
  // Read status: userResource.isLoading(), userResource.value()
}`,
      proTip: 'Automatically passes an AbortSignal to cancel in-flight HTTP requests when the reactive query changes.',
      tags: ['resource', 'async', 'fetch', 'signals', 'loader', 'v19'],
    },
    {
      id: 'sig-rxjs',
      title: 'toSignal() & toObservable()',
      category: 'Signals',
      version: 'v16+',
      summary: 'Seamless interoperability between RxJS Observables and Angular Signals.',
      codeTitle: 'component.ts',
      code: `import { toSignal, toObservable } from '@angular/core/rxjs-interop';

export class RxjsInteropComponent {
  // Observable -> Signal (automatically unsubscribes on destroy)
  user = toSignal(this.userService.user$, { initialValue: null });

  // Signal -> Observable
  search = signal('');
  search$ = toObservable(this.search);
}`,
      proTip: 'toSignal automatically handles subscription lifecycle on component destroy : no takeUntil() needed.',
      tags: ['toSignal', 'toObservable', 'rxjs', 'interop', 'observable'],
    },

    // ─── COMPONENT I/O ────────────────────────────────────────────────────────
    {
      id: 'io-input',
      title: 'input() & input.required()',
      category: 'Component I/O',
      version: 'v17.1+',
      summary: 'Signal-based component inputs with strict TypeScript type-checking. Replaces @Input() decorator.',
      codeTitle: 'child.component.ts',
      code: `import { Component, input } from '@angular/core';

@Component({ ... })
export class UserCardComponent {
  // Optional input with default value
  avatarUrl = input<string>('/default.png');

  // Mandatory input (compile error if omitted by parent)
  username = input.required<string>();

  // Transform input on the fly
  age = input(0, { transform: (v: number | string) => Number(v) });
}`,
      proTip: 'Signal inputs are read-only signals. They compose directly with computed() without needing ngOnChanges.',
      tags: ['input', 'input.required', 'props', 'component', 'signals'],
    },
    {
      id: 'io-output',
      title: 'output()',
      category: 'Component I/O',
      version: 'v17.3+',
      summary: 'Type-safe functional component event dispatcher. Replaces @Output() and EventEmitter.',
      codeTitle: 'child.component.ts',
      code: `import { Component, output } from '@angular/core';

@Component({ ... })
export class FilterComponent {
  // Clean event output
  filterChanged = output<string>();

  onSelect(category: string) {
    this.filterChanged.emit(category); // Emit payload to parent
  }
}`,
      proTip: 'output() has zero RxJS dependency and produces a leaner bundle than legacy new EventEmitter().',
      tags: ['output', 'event', 'emit', 'component', 'props'],
    },
    {
      id: 'io-model',
      title: 'model()',
      category: 'Component I/O',
      version: 'v17.2+',
      summary: 'Two-way reactive binding primitive. Creates both a signal input and an output event automatically.',
      codeTitle: 'toggle.component.ts',
      code: `import { Component, model } from '@angular/core';

@Component({ ... })
export class ToggleComponent {
  // Two-way binding signal:
  checked = model<boolean>(false);

  toggle() {
    this.checked.update(c => !c); // Updates parent [(checked)] too!
  }
}`,
      proTip: 'In the parent template, bind with "banana-in-a-box" syntax: <app-toggle [(checked)]="isEnabled" />.',
      tags: ['model', 'two-way', 'binding', 'component', 'signals'],
    },

    // ─── TEMPLATES & DEFER ────────────────────────────────────────────────────
    {
      id: 'tpl-defer',
      title: '@defer Deferrable Views',
      category: 'Templates',
      version: 'v17+',
      summary: 'Declarative lazy loading of heavy component bundles directly in templates with zero router config.',
      codeTitle: 'template.html',
      code: `@defer (on viewport; prefetch on idle) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder (minimum 500ms) {
  <div class="skeleton">Chart loading placeholder...</div>
} @loading (after 100ms; minimum 300ms) {
  <div class="spinner">Loading chart bundle...</div>
} @error {
  <div class="alert">Failed to load chart component.</div>
}`,
      proTip: 'Supported triggers: on viewport, on interaction, on hover, on idle, on timer(5s), or when condition.',
      tags: ['defer', 'lazy', 'prefetch', 'placeholder', 'loading', 'templates'],
    },
    {
      id: 'tpl-projection',
      title: 'Content Projection (<ng-content>)',
      category: 'Templates',
      version: 'Angular Core',
      summary: 'Multi-slot component content projection using CSS attribute and class selectors.',
      codeTitle: 'modal.component.html',
      code: `<div class="modal">
  <header class="modal-header">
    <ng-content select="[slot=header]" />
  </header>
  <main class="modal-body">
    <ng-content /> <!-- Default body slot -->
  </main>
  <footer class="modal-footer">
    <ng-content select="[slot=footer]" />
  </footer>
</div>`,
      proTip: 'Use ngProjectAs in consumers if projecting inside ng-container to bypass DOM wrapper elements.',
      tags: ['ng-content', 'projection', 'slots', 'templates'],
    },

    // ─── DEPENDENCY INJECTION ─────────────────────────────────────────────────
    {
      id: 'di-inject',
      title: 'inject() Function',
      category: 'Dependency Injection',
      version: 'v14+',
      summary: 'Functional dependency injection. Eliminates bloated constructor parameter injection and super() chaining.',
      codeTitle: 'service.ts',
      code: `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Optional injection with fallback
  private logger = inject(LoggerService, { optional: true });
}`,
      proTip: 'Greatly simplifies class inheritance because derived classes no longer need to pass dependencies to super().',
      tags: ['inject', 'di', 'dependency injection', 'service'],
    },
    {
      id: 'di-guards',
      title: 'Functional Route Guards',
      category: 'Dependency Injection',
      version: 'v15+',
      summary: 'Clean, composable functions replacing legacy class-based CanActivate guards and interfaces.',
      codeTitle: 'app.routes.ts',
      code: `import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin.component'),
    canActivate: [
      () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        return auth.isLoggedIn() ? true : router.parseUrl('/login');
      }
    ]
  }
];`,
      proTip: 'Functional guards can be chained, exported as reusable arrow functions, and testable without class mocking.',
      tags: ['guard', 'canActivate', 'router', 'di', 'functional'],
    },
  ];

  filteredCheats = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();

    return this.allCheats.filter((item) => {
      const matchesCat = cat === 'All' || item.category === cat;
      if (!matchesCat) return false;

      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      );
    });
  });

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data && data['category']) {
        this.selectedCategory.set(data['category']);
      }
    });
  }

  getCountForCategory(cat: string): number {
    if (cat === 'All') return this.allCheats.length;
    return this.allCheats.filter((c) => c.category === cat).length;
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
  }

  trackById(_index: number, item: CheatItem): string {
    return item.id;
  }
}
