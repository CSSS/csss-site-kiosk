import {
  afterRenderEffect,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  viewChild
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateCardComponent } from '@core/date-card/date-card.component';
import { EventsService } from '@screens/events/events.service';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { SWIPER_PAGINATION_BULLET_STYLES } from '../../../styles/overrides/swiper';
import { placeHolderImgUrl } from '../../../utils/placeholders';

@Component({
  selector: 'ksk-event-widget',
  imports: [DateCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget {
  private readonly eventsService = inject(EventsService);

  protected swiperRef = viewChild.required<ElementRef>('swiperRef');

  protected cardWidth = 520;

  events = toSignal(this.eventsService.getCurrentEvents(), { initialValue: [] });

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

  getFallbackPosterUrl(index: number, url?: string | null): string {
    return url ?? placeHolderImgUrl(index);
  }
}
