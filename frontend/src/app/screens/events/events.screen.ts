import { Component, inject, signal } from '@angular/core';
import {
  CalendarDatePipe,
  type CalendarEvent,
  CalendarMonthViewComponent,
  DateAdapter,
  provideCalendar
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TimeService } from '../../core/time.service';

interface KioskCalendarMeta {
  type: 'holiday' | 'csss' | 'sfu' | 'other';
}

type KioskCalendarEvent = Omit<CalendarEvent, 'meta'> & Required<Pick<CalendarEvent, 'meta'>>;

@Component({
  selector: 'ksk-events-screen',
  imports: [CalendarMonthViewComponent, CalendarDatePipe],
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
  private timeService = inject(TimeService);
  /**
   * Number of events that can be displayed before the cell overflows.
   */
  protected readonly maxEvents = 5;

  /**
   * Date to highlight
   */
  protected viewDate = this.timeService.currentTime();

  private id?: number;

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

  ngOnDestroy(): void {
    if (this.id !== undefined) {
      clearInterval(this.id);
    }
  }

  protected eventClicked(
    event: KioskCalendarEvent,
    day: { date: Date; events: KioskCalendarEvent[] },
    domEvent: MouseEvent
  ): void {
    domEvent.stopPropagation();
    console.log('Event', event, day);
  }

  protected dayClicked(
    {
      date,
      events
    }: {
      date: Date;
      events: KioskCalendarEvent[];
    },
    domEvent?: MouseEvent
  ): void {
    domEvent?.stopPropagation();
    console.log('Day', date, events);
  }
}
