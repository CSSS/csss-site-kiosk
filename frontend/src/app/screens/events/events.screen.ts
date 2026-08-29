import { Component } from '@angular/core';
import { SlidingTabDirective } from '@core/sliding-tabs/sliding-tab.directive';
import { SlidingTabsComponent } from '@core/sliding-tabs/sliding-tabs.component';
import { EventsBrowserComponent } from '@screens/events/events-browser/events-browser.component';
import { EventsCalendarComponent } from '@screens/events/events-calendar/events-calendar.component';

@Component({
  selector: 'ksk-events-screen',
  imports: [
    EventsCalendarComponent,
    EventsBrowserComponent,
    SlidingTabDirective,
    SlidingTabsComponent
  ],
  templateUrl: './events.screen.html',
  styleUrl: './events.screen.scss'
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EventsScreen {}
