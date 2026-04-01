import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-page1',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4 text-blue-600">Sub Page 1</h2>
      <blockquote class="text-lg italic border-l-4 border-blue-500 pl-4 py-2 mb-4">
        "Do or do not. There is no try."
      </blockquote>
      <p class="text-gray-600 mb-4">- Master Yoda</p>
      <button
        (click)="goHome()"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Navigate Back
      </button>
    </div>
  `,
})
export class SubPage1Component {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
