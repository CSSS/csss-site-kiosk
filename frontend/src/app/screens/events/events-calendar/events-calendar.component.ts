import { Component, inject, input } from '@angular/core';
import { CalendarDatePipe, CalendarEvent, CalendarMonthViewComponent } from 'angular-calendar';
import { TimeService } from '../../../core/time.service';

export type KioskCalendarEvent = Omit<CalendarEvent, 'meta'> &
  Required<Pick<CalendarEvent, 'meta'>>;

@Component({
  selector: 'ksk-events-calendar',
  imports: [CalendarMonthViewComponent, CalendarDatePipe],
  templateUrl: './events-calendar.component.html',
  styleUrl: './events-calendar.component.scss'
})
export class EventsCalendarComponent {
  events = input.required<KioskCalendarEvent[]>();

  private timeService = inject(TimeService);

  /**
   * Date to highlight
   */
  protected viewDate = this.timeService.currentTime();

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
