import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeService } from '@core/time.service';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import {
  CustomCalendarDateFormatter,
  CustomCalendarUtils
} from '@screens/events/events-calendar/calendar-utils';
import {
  CalendarDateFormatter,
  CalendarDatePipe,
  CalendarEvent,
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
import { map } from 'rxjs';
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

  private readonly timeService = inject(TimeService);

  /**
   * Date to highlight
   */
  protected viewDate = this.timeService.currentDatetime();

  protected view = CalendarView.Month;

  protected events = toSignal(
    this.eventsService
      .getCurrentEvents()
      .pipe(map(events => events.map(e => e.getCalendarEvent()))),
    { initialValue: [] }
  );

  /**
   * Number of events that can be displayed before the cell overflows.
   * One day we can calculate this based off the heights or use it to calculate the event heights.
   */
  protected readonly maxEvents = 4;

  protected eventClicked(
    event: CalendarEvent,
    day: { date: Date; events: CalendarEvent[] },
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
      events: CalendarEvent[];
    },
    domEvent?: MouseEvent
  ): void {
    domEvent?.stopPropagation();
    console.log('Day', date, events);
  }
}
