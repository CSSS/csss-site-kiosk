import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimeService } from '../../core/time.service';

@Component({
  selector: 'ksk-clock-weather-widget',
  imports: [DatePipe],
  templateUrl: './clock-weather.widget.html',
  styleUrl: './clock-weather.widget.scss'
})
export class ClockWeatherWidget {
  timeService = inject(TimeService);
  // TODO: Add weather service
}
