import { Routes } from '@angular/router';
import { ClassLookupComponent } from './screens/class-lookup/class-lookup.screen';
import { HomeScreenComponent } from './screens/home/home.screen';

export const routes: Routes = [
  {
    path: 'courses',
    component: ClassLookupComponent
  },
  {
    path: '',
    component: HomeScreenComponent
  }
];
