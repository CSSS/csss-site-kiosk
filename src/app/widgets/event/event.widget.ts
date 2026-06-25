import { Component } from '@angular/core';

interface Event {
  posterUrl: string;
  title: string;
  location?: string;
}

@Component({
  selector: 'ksk-event-widget',
  imports: [],
  templateUrl: './event.widget.html',
  styleUrl: './event.widget.scss'
})
export class EventWidget {
  events: Event[] = [
    {
      posterUrl: 'https://dummyimage.com/600x400/000/fff',
      title: 'Test Description',
      location: 'Location'
    }
  ];
}
