import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { KioskEvent } from '../event.types';

@Component({
  imports: [NgOptimizedImage, QRCodeComponent, EventDetailsComponent],
  selector: 'ksk-events-modal',
  styleUrl: './events-modal.component.scss',
  templateUrl: './events-modal.component.html',
  host: {
    '[style.--img-width]': 'imgWidth + "px"',
    '[style.--img-height]': 'imgHeight + "px"',
    '[style.--qr-code-size]': 'qrCodeSize + "px"'
  }
})
export class EventsModalComponent {
  protected readonly event = input.required<KioskEvent>();

  imgHeight = 375;
  imgWidth = this.imgHeight * (4 / 5);
  qrCodeSize = 160;
}
