import { Component, signal } from '@angular/core';
import { SlidingTabDirective } from '@core/sliding-tabs/sliding-tab.directive';
import { SlidingTabsComponent } from '@core/sliding-tabs/sliding-tabs.component';
import { KioskCalendarEvent } from '@screens/events/event.types';
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
export class EventsScreen {
  /**
   * TODO: Have this fetched from the web server.
   */
  events = signal<KioskCalendarEvent[]>([
    {
      start: new Date(),
      title: 'CSSS event',
      meta: {
        type: 'csss'
      }
    },
    {
      start: new Date(),
      title: 'SFU event',
      meta: {
        type: 'sfu'
      }
    },
    {
      start: new Date(),
      title: 'Holiday',
      meta: {
        type: 'holiday'
      }
    },
    {
      start: new Date(),
      title: 'Other long event title',
      meta: {
        type: 'other'
      }
    },
    {
      start: new Date(Date.now() + 3600000 * 24),
      title: 'Event tomorrow',
      meta: {
        type: 'other'
      }
    },
    {
      start: new Date(Date.now() + 3600000 * 24),
      end: new Date(Date.now() + 3600000 * 24 * 3),
      title: 'Multi-day',
      meta: {
        type: 'csss'
      }
    }
  ]);
}
