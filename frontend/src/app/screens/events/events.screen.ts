import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component, signal } from '@angular/core';
import { KioskCalendarEvent } from '@screens/events/event.types';
import { EventsBrowserComponent } from '@screens/events/events-browser/events-browser.component';
import { EventsCalendarComponent } from '@screens/events/events-calendar/events-calendar.component';

@Component({
  selector: 'ksk-events-screen',
  imports: [
    EventsCalendarComponent,
    EventsBrowserComponent,
    TabList,
    Tab,
    Tabs,
    TabPanel,
    TabContent
  ],
  templateUrl: './events.screen.html',
  styleUrl: './events.screen.scss'
})
export class EventsScreen {
  readonly tabSelected = signal<'browse' | 'calendar'>('browse');

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
