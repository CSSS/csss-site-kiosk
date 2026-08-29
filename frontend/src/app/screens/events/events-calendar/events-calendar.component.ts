import { Component, inject, input } from '@angular/core';
import { TimeService } from '@core/time.service';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { KioskCalendarEvent } from '@screens/events/event.types';
import {
  CustomCalendarDateFormatter,
  CustomCalendarUtils
} from '@screens/events/events-calendar/calendar-utils';
import {
  CalendarDateFormatter,
  CalendarDatePipe,
  CalendarMonthViewComponent,
  CalendarNextViewDirective,
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarUtils,
  CalendarView,
  DateAdapter,
  provideCalendar
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventsService } from '../events.service';

@Component({
  selector: 'ksk-events-calendar',
  imports: [
    CalendarMonthViewComponent,
    CalendarDatePipe,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    LucideChevronLeft,
    LucideChevronRight
  ],
  providers: [
    provideCalendar(
      {
        provide: DateAdapter,
        useFactory: adapterFactory
      },
      {
        utils: {
          provide: CalendarUtils,
          useClass: CustomCalendarUtils
        }
      }
    ),
    {
      provide: CalendarDateFormatter,
      useClass: CustomCalendarDateFormatter
    }
  ],
  templateUrl: './events-calendar.component.html',
  styleUrl: './events-calendar.component.scss'
})
export class EventsCalendarComponent {
  private readonly eventsService = inject(EventsService);

  events = input.required<KioskCalendarEvent[]>();

  view = CalendarView.Month;

  private timeService = inject(TimeService);

  /**
   * Date to highlight
   */
  protected viewDate = this.timeService.currentDatetime();

  /**
   * Number of events that can be displayed before the cell overflows.
   */
  protected readonly maxEvents = 4;

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
