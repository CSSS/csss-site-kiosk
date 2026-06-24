import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimeService } from './time.service';

@Component({
  selector: 'ksk-clock-weather',
  imports: [DatePipe],
  templateUrl: './clock-weather.component.html',
  styleUrl: './clock-weather.component.scss'
})
export class ClockWeatherComponent {
  timeService = inject(TimeService);
  // TODO: Add weather service
}
