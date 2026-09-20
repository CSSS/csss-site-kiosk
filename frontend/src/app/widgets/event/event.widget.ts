import {
  afterRenderEffect,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  viewChild
} from '@angular/core';
import { DateCardComponent } from '@core/date-card/date-card.component';
import { ModalService } from '@core/modal/modal.service';
import type { KioskEvent } from '@screens/events/event.types';
import { EventsModalComponent } from '@screens/events/events-modal/events-modal.component';
import { EventsService } from '@screens/events/events.service';
import {
  SWIPER_PAGINATION_BULLET_STYLES,
  SWIPER_PAGINATION_STYLES_URL
} from '@styles/overrides/swiper';
import { SwiperContainer } from 'swiper/element';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'ksk-event-widget',
  imports: [DateCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget {
  private readonly eventsService = inject(EventsService);

  private readonly modal = inject(ModalService);

  protected swiperRef = viewChild.required<ElementRef<SwiperContainer>>('swiperRef');

  protected cardWidth = 520;

  events = this.eventsService.currentEvents;

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

        if (eventCount === 0) {
          swiperEl.swiper.update();
          return;
        }

        this.updateSwiper();
      }
    });
  }

  /**
   * This ensures autoplay continues to work after updates.
   */
  private updateSwiper(): void {
    const swiper = this.swiperRef().nativeElement.swiper;
    const activeSlide = swiper.slides[swiper.activeIndex];
    const shouldRestartAutoplay = swiper.autoplay.running && !swiper.autoplay.paused;

    if (shouldRestartAutoplay) {
      swiper.autoplay.stop();
    }

    // Swiper's loop metadata is only created during initialization. Rebuild it so
    // slides rendered later by Angular receive the correct pagination index.
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.update();

    const activeSlideIndex = activeSlide?.getAttribute('data-swiper-slide-index');

    if (activeSlide?.isConnected && activeSlideIndex !== null) {
      swiper.slideToLoop(Number(activeSlideIndex), 0, false);
    }

    if (shouldRestartAutoplay) {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.autoplay.start();
        }
      });
    }
  }

  initializeSwiper(): void {
    const swiperEl = this.swiperRef().nativeElement;

    const swiperParams: SwiperOptions = {
      modules: [Autoplay, EffectCoverflow, Pagination],
      effect: 'coverflow',
      slidesPerView: 'auto',
      speed: 600,
      centeredSlides: true,
      loop: true,
      resistanceRatio: 0.5,
      pagination: {
        clickable: true,
        dynamicBullets: true
      },
      autoplay: {
        delay: 5000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false
      },
      coverflowEffect: {
        rotate: 0,
        depth: 360,
        slideShadows: false
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
