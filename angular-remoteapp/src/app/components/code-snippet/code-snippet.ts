import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="code-box">
      <div class="code-header">
        <div class="code-header-left">
          <span class="code-lang-dot"></span>
          <span class="code-title">{{ title() || 'TypeScript' }}</span>
        </div>
        <button
          type="button"
          class="code-copy-btn"
          [class.copied]="copied()"
          (click)="copyCode()"
          [attr.aria-label]="copied() ? 'Copied to clipboard' : 'Copy code to clipboard'"
        >
          <i [class]="copied() ? 'pi pi-check text-emerald-400' : 'pi pi-copy'"></i>
          <span>{{ copied() ? 'Copied!' : 'Copy' }}</span>
        </button>
      </div>
      <pre class="code-content"><code>{{ code().trim() }}</code></pre>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .code-box {
        background: #090d16;
        border: 1px solid #1e293b;
        border-radius: 8px;
        overflow: hidden;
        margin: 0.75rem 0;
      }
      .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.45rem 0.85rem;
        background: #0f172a;
        border-bottom: 1px solid #1e293b;
        font-size: 0.75rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #94a3b8;
      }
      .code-header-left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .code-lang-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #dd0031;
        display: inline-block;
      }
      .code-title {
        font-weight: 600;
        color: #cbd5e1;
      }
      .code-copy-btn {
        background: #1e293b;
        color: #cbd5e1;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 0.3rem 0.65rem;
        min-height: 28px;
        font-size: 0.74rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        transition: all 0.15s ease;
        touch-action: manipulation;
        user-select: none;
      }
      .code-copy-btn:hover {
        background: #334155;
        color: #ffffff;
        border-color: #475569;
      }
      .code-copy-btn.copied {
        background: #064e3b;
        color: #34d399;
        border-color: #059669;
      }
      .code-content {
        margin: 0;
        padding: 0.85rem 1rem;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 0.82rem;
        line-height: 1.55;
        color: #f1f5f9;
        white-space: pre;
        tab-size: 2;
      }
      .code-content code {
        font-family: inherit;
        color: inherit;
      }
    `,
  ],
})
export class CodeSnippetComponent {
  code = input.required<string>();
  title = input<string>('');

  copied = signal<boolean>(false);

  copyCode(): void {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(this.code().trim());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
