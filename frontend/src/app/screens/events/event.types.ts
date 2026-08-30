import { type Event, EventStatusEnum } from '@csss-api';
import { CalendarEvent } from 'angular-calendar';

const TIME_RANGE_FORMATTER: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

const DATETIME_RANGE_FORMATTER: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};

export type KioskCalendarEvent = Omit<CalendarEvent, 'meta'> & {
  meta: KioskEvent;
};

export class KioskEvent implements Event {
  name: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location?: string | null;
  organizer?: string | null;
  status: EventStatusEnum;
  url?: string | null;
  image_id?: number | null;
  eid: number;
  group_id?: string | null;
  startDatetime: Date;
  endDatetime: Date;
  posterUrl?: string | null;
  isMultiDayEvent?: boolean;

  constructor(event: Event, startDatetime: Date, endDatetime: Date) {
    this.name = event.name;
    this.description = event.description;
    this.start_datetime = event.start_datetime;
    this.end_datetime = event.end_datetime;
    this.location = event.location;
    this.organizer = event.organizer;
    this.status = event.status;
    this.url = event.url;
    this.image_id = event.image_id;
    this.eid = event.eid;
    this.group_id = event.group_id;
    this.startDatetime = startDatetime;
    this.endDatetime = endDatetime;
    this.isMultiDayEvent = this.startDatetime.toDateString() !== this.endDatetime.toDateString();
  }

  get timeRange(): string {
    const start = this.startDatetime.toLocaleTimeString('en-CA', TIME_RANGE_FORMATTER);
    const end = this.endDatetime.toLocaleTimeString('en-CA', TIME_RANGE_FORMATTER);

    return `${start} - ${end}`;
  }

  /**
   * Used if the event is multi-day.
   */
  get datetimeRange(): [string, string] {
    const start = this.startDatetime.toLocaleString('en-CA', DATETIME_RANGE_FORMATTER);
    const end = this.endDatetime.toLocaleString('en-CA', DATETIME_RANGE_FORMATTER);

    return [start, end];
  }

  getCalendarEvent(): KioskCalendarEvent {
    return {
      id: this.eid,
      start: this.startDatetime,
      end: this.endDatetime,
      title: this.name,
      meta: this
    };
  }
}
