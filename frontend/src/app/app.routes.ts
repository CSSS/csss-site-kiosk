import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'classes',
    loadComponent: () =>
      import('./screens/class-lookup/class-lookup.screen').then(
        module => module.ClassLookupComponent
      )
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./screens/events/events.screen').then(module => module.EventsScreen)
  },
  {
    path: '',
    loadComponent: () => import('./screens/home/home.screen').then(module => module.HomeScreen)
  }
];
