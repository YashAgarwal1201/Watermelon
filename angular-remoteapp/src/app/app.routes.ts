// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SubPage1Component } from './pages/sub-page1/sub-page1';
import { SubPage2Component } from './pages/sub-page2/sub-page2';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sub-page1', component: SubPage1Component },
  { path: 'sub-page2', component: SubPage2Component },
  { path: '**', redirectTo: '' },
];
