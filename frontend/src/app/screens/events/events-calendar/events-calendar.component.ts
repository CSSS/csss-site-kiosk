import { Component, computed, inject } from '@angular/core';
import { ModalService } from '@core/modal/modal.service';
import { TimeService } from '@core/time.service';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
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
import { KioskCalendarEvent } from '../event.types';
import { EventsModalComponent } from '../events-modal/events-modal.component';
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

  private readonly modal = inject(ModalService);

  /**
   * Date to highlight
   */
  protected viewDate = this.timeService.currentDatetime();

  protected view = CalendarView.Month;

  protected events = computed(() =>
    this.eventsService
      // TODO: We'll eventually need to make sure this pulls only by month, if the response gets too big.
      .events()
      .map(event => event.getCalendarEvent())
  );

  /**
   * Number of events that can be displayed before the cell overflows.
   * One day we can calculate this based off the heights or use it to calculate the event heights.
   */
  protected readonly maxEvents = 4;

  protected eventClicked(
    event: KioskCalendarEvent,
    _: { date: Date; events: KioskCalendarEvent[] },
    domEvent: MouseEvent
  ): void {
    domEvent.stopPropagation();

    this.modal.open({
      type: 'component',
      content: EventsModalComponent,
      title: event.title,
      inputs: {
        event: event.meta
      }
    });
  }
}
