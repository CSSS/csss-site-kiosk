import { type Event, EventStatusEnum } from '@csss-api';
import { CalendarEvent } from 'angular-calendar';

export type KioskCalendarEvent = Omit<CalendarEvent, 'meta'> &
  Required<Pick<CalendarEvent, 'meta'>>;

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
  endDateTime: Date;
  posterUrl?: string | null;

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
    this.endDateTime = endDatetime;
  }
}
