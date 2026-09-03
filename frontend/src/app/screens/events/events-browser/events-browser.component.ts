import { NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  viewChild
} from '@angular/core';
import { DateCardComponent } from '@core/date-card/date-card.component';
import { Pagination } from 'swiper/modules';

import { toSignal } from '@angular/core/rxjs-interop';
import { ModalService } from '@core/modal/modal.service';
import { SWIPER_PAGINATION_BULLET_STYLES } from '@styles/overrides/swiper';
import 'swiper/css/pagination';
import { EventDetailsComponent } from '../event-details/event-details.component';
import { KioskEvent } from '../event.types';
import { EventsModalComponent } from '../events-modal/events-modal.component';
import { EventsService } from '../events.service';

@Component({
  selector: 'ksk-events-browser',
  imports: [NgOptimizedImage, SlicePipe, DateCardComponent, EventDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './events-browser.component.html',
  styleUrl: './events-browser.component.scss'
})
export class EventsBrowserComponent {
  private readonly eventsService = inject(EventsService);

  private readonly modal = inject(ModalService);

  events = toSignal(this.eventsService.getCurrentEvents(), { initialValue: [] });

  IMG_H = 400;
  IMG_W = (this.IMG_H * 4) / 5;

  swiperRef = viewChild.required<ElementRef>('swiperRef');

  constructor() {
    afterRenderEffect({
      write: () => {
        const eventCount = this.events().length;
        const swiperEl = this.swiperRef().nativeElement;

        if (!swiperEl.swiper?.initialized) {
          if (eventCount > 0) {
            this.initializeSwiper();
          }

          return;
        }

        swiperEl.swiper.update();
      }
    });
  }

  initializeSwiper(): void {
    const swiperEl = this.swiperRef().nativeElement;

    const swiperParams = {
      modules: [Pagination],
      slidesPerView: 'auto',
      spaceBetween: 10,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.5,
      pagination: {
        clickable: true
      },
      injectStylesUrls: ['/swiper/pagination-element.min.css'],
      injectStyles: [SWIPER_PAGINATION_BULLET_STYLES]
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }

  openEventModal(event: KioskEvent): void {
    this.modal.open({
      type: 'component',
      title: event.name,
      content: EventsModalComponent,
      inputs: {
        event: event
      }
    });
  }
}
