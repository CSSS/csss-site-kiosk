import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild
} from '@angular/core';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { SWIPER_PAGINATION_BULLET_STYLES } from '../../../styles/overrides/swiper';
import { placeHolderImgUrl } from '../../../utils/placeholders';
import { DateCardComponent } from '../../core/date-card/date-card.component';

export interface KioskEvent {
  posterUrl: string;
  title: string;
  location?: string;
  date: Date;
}

@Component({
  selector: 'ksk-event-widget',
  imports: [DateCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget implements AfterViewInit {
  swiperRef = viewChild.required<ElementRef>('swiperRef');

  cardWidth = 520;

  events: KioskEvent[] = [
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
      title: 'First Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(4),
      title: 'Second Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(5),
      title: 'Third Poster',
      location: 'Location',
      date: new Date()
    },
    {
      posterUrl: placeHolderImgUrl(6),
      title: 'Third Poster',
      location: 'Location',
      date: new Date()
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
        depth: 360,
        slideShadows: false
      },
      injectStylesUrls: ['/swiper/pagination-element.min.css'],
      injectStyles: [SWIPER_PAGINATION_BULLET_STYLES]
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}
