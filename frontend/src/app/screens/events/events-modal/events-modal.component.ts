import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { LucideCalendar, LucideClock, LucideMapPin, LucideUsersRound } from '@lucide/angular';
import { QRCodeComponent } from 'angularx-qrcode';
import { placeHolderImgUrl } from '../../../../utils/placeholders';
import { KioskEvent } from '../event.types';

@Component({
  imports: [
    NgOptimizedImage,
    DatePipe,
    LucideCalendar,
    LucideClock,
    LucideMapPin,
    LucideUsersRound,
    QRCodeComponent
  ],
  selector: 'ksk-events-modal',
  styleUrl: './events-modal.component.scss',
  templateUrl: './events-modal.component.html'
})
export class EventsModalComponent {
  protected readonly event = input.required<KioskEvent>();

  getFallbackPosterUrl(index: number, url?: string | null): string {
    return url ?? placeHolderImgUrl(index);
  }
}
