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

import { ModalService } from '@core/modal/modal.service';
import {
  SWIPER_PAGINATION_BULLET_STYLES,
  SWIPER_PAGINATION_STYLES_URL
} from '@styles/overrides/swiper';
import 'swiper/css/pagination';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
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

  events = this.eventsService.currentEvents;

  IMG_H = 400;
  IMG_W = (this.IMG_H * 4) / 5;

  swiperRef = viewChild.required<ElementRef<SwiperContainer>>('swiperRef');

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

    const swiperParams: SwiperOptions = {
      modules: [Pagination],
      slidesPerView: 'auto',
      spaceBetween: 10,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.5,
      pagination: {
        clickable: true,
        dynamicBullets: true
      },
      injectStylesUrls: [SWIPER_PAGINATION_STYLES_URL],
      injectStyles: [SWIPER_PAGINATION_BULLET_STYLES]
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();

    const paginationStyles = swiperEl.shadowRoot?.querySelector<HTMLLinkElement>(
      `link[href="${SWIPER_PAGINATION_STYLES_URL}"]`
    );
    const updatePagination = (): void => {
      if (!swiperEl.swiper.destroyed) {
        swiperEl.swiper.pagination.update();
      }
    };

    // Dynamic pagination measures its bullet width during initialization. The
    // injected stylesheet loads asynchronously, so repeat that measurement once
    // its bullet sizing rules are available.
    paginationStyles?.addEventListener('load', updatePagination, { once: true });
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
