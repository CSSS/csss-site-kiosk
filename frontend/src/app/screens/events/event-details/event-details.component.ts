import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { LucideCalendar, LucideClock, LucideMapPin, LucideUsersRound } from '@lucide/angular';
import { KioskEvent } from '../event.types';

@Component({
  imports: [LucideClock, LucideCalendar, LucideMapPin, LucideUsersRound, DatePipe],
  selector: 'ksk-event-details',
  styleUrl: './event-details.component.scss',
  templateUrl: './event-details.component.html'
})
export class EventDetailsComponent {
  event = input.required<KioskEvent>();
}
