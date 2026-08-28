import { DatePipe, NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild
} from '@angular/core';
import { DateCardComponent } from '@core/date-card/date-card.component';
import { KioskCalendarEvent } from '@screens/events/event.types';
import { KioskEvent } from '@widgets/event/event.widget';
import { Pagination } from 'swiper/modules';

import { LucideCalendar, LucideClock } from '@lucide/angular';
import { SWIPER_PAGINATION_BULLET_STYLES } from '@styles/overrides/swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { placeHolderImgUrl } from '../../../../utils/placeholders';

@Component({
  selector: 'ksk-events-browser',
  imports: [NgOptimizedImage, SlicePipe, DateCardComponent, DatePipe, LucideCalendar, LucideClock],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './events-browser.component.html',
  styleUrl: './events-browser.component.scss'
})
export class EventsBrowserComponent implements AfterViewInit {
  events = input.required<KioskCalendarEvent[]>();

  nextEvent = computed(() => this.events()[0] ?? null);

  DUMMY_IMG_H = 344;
  DUMMY_IMG_W = (this.DUMMY_IMG_H * 4) / 5;

  swiperRef = viewChild.required<ElementRef>('swiperRef');
  displayEvents: KioskEvent[] = [
    {
      posterUrl: placeHolderImgUrl(0),
      title: 'First Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(1),
      title: 'Second Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(2),
      title: 'Third Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(3),
      title: 'Fourth Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(4),
      title: 'Fifth Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(5),
      title: 'Sixth Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(6),
      title: 'Seventh Poster',
      location: 'Location',
      date: new Date()
    }
  ];

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
}
