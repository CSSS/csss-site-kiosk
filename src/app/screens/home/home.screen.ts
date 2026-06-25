import { Component } from '@angular/core';
import { ClockWeatherComponent } from '../../widgets/clock-weather/clock-weather.widget';

@Component({
  selector: 'ksk-home',
  imports: [ClockWeatherComponent],
  templateUrl: './home.screen.html',
  styleUrl: './home.screen.scss'
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HomeScreenComponent {}
