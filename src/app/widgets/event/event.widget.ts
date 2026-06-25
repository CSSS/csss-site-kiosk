import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

interface Event {
  posterUrl: string;
  title: string;
  location?: string;
}

@Component({
  selector: 'ksk-event-widget',
  imports: [NgOptimizedImage],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget {
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
    }
  ];
}
