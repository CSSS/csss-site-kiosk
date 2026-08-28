import { CalendarEvent } from 'angular-calendar';

export type KioskCalendarEvent = Omit<CalendarEvent, 'meta'> &
  Required<Pick<CalendarEvent, 'meta'>>;
