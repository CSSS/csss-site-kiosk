import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild
} from '@angular/core';
import { Autoplay } from 'swiper/modules';

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
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${1}`,
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${2}`,
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${3}`,
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${4}`,
      title: 'First Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${5}`,
      title: 'Second Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${6}`,
      title: 'Third Poster',
      location: 'Location'
    },
    {
      posterUrl: `https://dummyimage.com/380x500/000/fff&text=${7}`,
      title: 'Third Poster',
      location: 'Location'
    }
  ];

  ngAfterViewInit(): void {
    const swiperEl = this.swiperRef().nativeElement;

    const swiperParams = {
      modules: [Autoplay],
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.5,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}
