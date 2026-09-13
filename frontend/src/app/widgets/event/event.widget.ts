import {
  afterRenderEffect,
  Component,
  computed,
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
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { SWIPER_PAGINATION_BULLET_STYLES } from '../../../styles/overrides/swiper';

// Max number of events this can handle is 13.
// Any more and the pagination dots overflow.
const MAX_DISPLAYED_CARDS = 13;

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

  protected swiperRef = viewChild.required<ElementRef>('swiperRef');

  protected cardWidth = 520;

  events = computed(() => this.eventsService.currentEvents().slice(0, MAX_DISPLAYED_CARDS));

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

    const swiperParams = {
      modules: [Autoplay, EffectCoverflow, Pagination],
      effect: 'coverflow',
      slidesPerView: 'auto',
      speed: 600,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.5,
      pagination: {
        clickable: true
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
