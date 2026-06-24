import { Component } from '@angular/core';
import { ClockWeather } from '../../widgets/clock-weather/clock-weather.component';

@Component({
  selector: 'ksk-home',
  imports: [ClockWeather],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {}
