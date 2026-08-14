import { Routes } from '@angular/router';
import { ClassLookupComponent } from './screens/class-lookup/class-lookup.screen';
import { EventsScreen } from './screens/events/events.screen';
import { HomeScreen } from './screens/home/home.screen';

export const routes: Routes = [
  {
    path: 'classes',
    component: ClassLookupComponent
  },
  {
    path: 'events',
    component: EventsScreen
  },
  {
    path: '',
    component: HomeScreen
  }
];
