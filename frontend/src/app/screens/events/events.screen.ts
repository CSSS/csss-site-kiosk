import { Component, signal } from '@angular/core';
import { DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  EventsCalendarComponent,
  KioskCalendarEvent
} from './events-calendar/events-calendar.component';

@Component({
  selector: 'ksk-events-screen',
  imports: [EventsCalendarComponent],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
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
