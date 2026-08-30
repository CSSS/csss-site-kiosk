import { DatePipe, NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  viewChild
} from '@angular/core';
import { DateCardComponent } from '@core/date-card/date-card.component';
import { Pagination } from 'swiper/modules';

import { toSignal } from '@angular/core/rxjs-interop';
import { LucideCalendar, LucideClock } from '@lucide/angular';
import { SWIPER_PAGINATION_BULLET_STYLES } from '@styles/overrides/swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { placeHolderImgUrl } from '../../../../utils/placeholders';
import { EventsService } from '../events.service';

@Component({
  selector: 'ksk-events-browser',
  imports: [NgOptimizedImage, SlicePipe, DateCardComponent, DatePipe, LucideCalendar, LucideClock],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './events-browser.component.html',
  styleUrl: './events-browser.component.scss'
})
export class EventsBrowserComponent implements AfterViewInit {
  private readonly eventsService = inject(EventsService);

  events = toSignal(this.eventsService.getCurrentEvents(), { initialValue: [] });

  DUMMY_IMG_H = 400;
  DUMMY_IMG_W = (this.DUMMY_IMG_H * 4) / 5;

  swiperRef = viewChild.required<ElementRef>('swiperRef');

  ngAfterViewInit(): void {
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

  getFallbackPosterUrl(index: number, url?: string | null): string {
    return url ?? placeHolderImgUrl(index);
  }
}
