import { NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild
} from '@angular/core';
import { Pagination } from 'swiper/modules';
import { KioskEvent } from '../../../widgets/event/event.widget';
import { KioskCalendarEvent } from '../events.screen';

import 'swiper/css';
import 'swiper/css/pagination';
import { SWIPER_PAGINATION_BULLET_STYLES } from '../../../../styles/overrides/swiper';
import { makeDummyImageUrl } from '../../../../utils/placeholders';

@Component({
  selector: 'ksk-events-browser',
  imports: [NgOptimizedImage, SlicePipe],
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
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '1'
      }),
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '2'
      }),
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '3'
      }),
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '4'
      }),
      title: 'Fourth Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '5'
      }),
      title: 'Fifth Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '6'
      }),
      title: 'Sixth Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '7'
      }),
      title: 'Seventh Poster',
      location: 'Location'
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
