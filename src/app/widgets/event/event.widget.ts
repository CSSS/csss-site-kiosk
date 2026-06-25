import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild
} from '@angular/core';

interface Event {
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

  events: Event[] = [
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: 'https://dummyimage.com/380x500/000/fff',
      title: 'Third Poster',
      location: 'Location'
    }
  ];

  ngAfterViewInit(): void {
    const swiperEl = this.swiperRef().nativeElement;

    const swiperParams = {
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      spaceBetween: 10,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.5
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}
