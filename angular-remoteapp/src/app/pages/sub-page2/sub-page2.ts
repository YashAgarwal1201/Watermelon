import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-page2',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4 text-green-600">Sub Page 2</h2>
      <blockquote class="text-lg italic border-l-4 border-green-500 pl-4 py-2 mb-4">
        "The Force will be with you. Always."
      </blockquote>
      <p class="text-gray-600 mb-4">- Obi-Wan Kenobi</p>
      <button
        (click)="goHome()"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go Home
      </button>
    </div>
  `,
})
export class SubPage2Component {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
