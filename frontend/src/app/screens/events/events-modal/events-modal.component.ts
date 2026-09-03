import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { KioskEvent } from '../event.types';

@Component({
  imports: [NgOptimizedImage, QRCodeComponent, EventDetailsComponent],
  selector: 'ksk-events-modal',
  styleUrl: './events-modal.component.scss',
  templateUrl: './events-modal.component.html'
})
export class EventsModalComponent {
  protected readonly event = input.required<KioskEvent>();
}
