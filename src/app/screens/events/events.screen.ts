import { Component, inject, signal } from '@angular/core';
import {
  CalendarDatePipe,
  CalendarEvent,
  CalendarMonthViewComponent,
  DateAdapter,
  provideCalendar
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Event } from '../../api/generated/csss-backend';
import { TimeService } from '../../core/time.service';

interface KioskCalendarEvent extends Event {
  type: 'holiday' | 'csss' | 'other';
}

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

  events = signal<CalendarEvent<KioskCalendarEvent>[]>([
    {
      start: new Date(),
      title: 'Event 1',
      meta: {
        type: 'csss',
        name: '',
        start_time: '',
        end_time: '',
        eid: 0
      }
    },
    {
      start: new Date(),
      title: 'Event 2'
    },
    {
      start: new Date(),
      title: 'Event 3'
    },
    {
      start: new Date(),
      title: 'Event 4 aaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
  ]);

  constructor() {
    // this.id = setInterval(() => {
    //   this.events.update(events => [
    //     ...events,
    //     {
    //       start: new Date(),
    //       title: `Event ${events.length + 1}`
    //     }
    //   ]);
    // }, 3000);
  }

  ngOnDestroy(): void {
    if (this.id !== undefined) {
      clearInterval(this.id);
    }
  }

  protected eventClicked(
    event: CalendarEvent<KioskCalendarEvent>,
    day: { date: Date; events: CalendarEvent<KioskCalendarEvent>[] },
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
      events: CalendarEvent<KioskCalendarEvent>[];
    },
    domEvent?: MouseEvent
  ): void {
    domEvent?.stopPropagation();
    console.log('Day', date, events);
  }
}
