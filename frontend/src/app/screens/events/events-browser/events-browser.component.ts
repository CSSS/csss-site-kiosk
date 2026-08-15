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
  DUMMY_IMAGE_URL = `https://dummyimage.com/${this.DUMMY_IMG_W}x${this.DUMMY_IMG_H}/333`;
  swiperRef = viewChild.required<ElementRef>('swiperRef');
  displayEvents: KioskEvent[] = [
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${1}`,
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${2}`,
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${3}`,
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${4}`,
      title: 'Fourth Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${5}`,
      title: 'Fifth Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${6}`,
      title: 'Sixth Poster',
      location: 'Location'
    },
    {
      posterUrl: `${this.DUMMY_IMAGE_URL}&text=${7}`,
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
