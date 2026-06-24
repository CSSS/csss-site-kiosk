import { Routes } from '@angular/router';
import { ClassLookupComponent } from './screens/class-lookup/class-lookup.component';
import { HomeComponent } from './screens/home/home.component';

export const routes: Routes = [
  {
    path: 'courses',
    component: ClassLookupComponent
  },
  {
    path: '',
    component: HomeComponent
  }
];
