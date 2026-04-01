import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Home Page</h2>
      <p class="mb-4 text-gray-700">
        Welcome to the Angular 20 Remote Application with Module Federation!
      </p>
      <div class="flex gap-4">
        <button
          (click)="goToPage1()"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Sub Page 1
        </button>
        <button
          (click)="goToPage2()"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Go to Sub Page 2
        </button>
      </div>
    </div>
  `,
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToPage1() {
    this.router.navigate(['/sub-page1']);
  }

  goToPage2() {
    this.router.navigate(['/sub-page2']);
  }
}
