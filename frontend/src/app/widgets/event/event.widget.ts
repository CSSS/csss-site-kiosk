import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild
} from '@angular/core';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { SWIPER_PAGINATION_BULLET_STYLES } from '../../../styles/overrides/swiper';
import { makeDummyImageUrl } from '../../../utils/placeholders';

export interface KioskEvent {
  posterUrl: string;
  title: string;
  location?: string;
}

@Component({
  selector: 'ksk-event-widget',
  imports: [NgOptimizedImage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget implements AfterViewInit {
  swiperRef = viewChild.required<ElementRef>('swiperRef');

  DUMMY_IMG_H = 500;
  DUMMY_IMG_W = 400;

  events: KioskEvent[] = [
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
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '5'
      }),
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '6'
      }),
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: makeDummyImageUrl({
        width: this.DUMMY_IMG_W,
        height: this.DUMMY_IMG_H,
        text: '7'
      }),
      title: 'Third Poster',
      location: 'Location'
    }
  ];

  ngAfterViewInit(): void {
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
        depth: 240,
        slideShadows: false
      },
      injectStylesUrls: ['/swiper/pagination-element.min.css'],
      injectStyles: [SWIPER_PAGINATION_BULLET_STYLES]
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}
