import { Routes } from '@angular/router';
import { CheatSheetComponent } from './pages/cheat-sheet/cheat-sheet';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: 'overview',
    component: CheatSheetComponent,
    data: { category: 'All' },
  },
  {
    path: 'control-flow',
    component: CheatSheetComponent,
    data: { category: 'Control Flow' },
  },
  {
    path: 'signals',
    component: CheatSheetComponent,
    data: { category: 'Signals' },
  },
  {
    path: 'components',
    component: CheatSheetComponent,
    data: { category: 'Component I/O' },
  },
  {
    path: 'templates',
    component: CheatSheetComponent,
    data: { category: 'Templates' },
  },
  {
    path: 'di',
    component: CheatSheetComponent,
    data: { category: 'Dependency Injection' },
  },

  // Gracefully handle any legacy or deep subroute links
  { path: 'components/**', redirectTo: 'components' },
  { path: 'signals/**', redirectTo: 'signals' },
  { path: 'di/**', redirectTo: 'di' },
  { path: '**', redirectTo: 'overview' },
];
