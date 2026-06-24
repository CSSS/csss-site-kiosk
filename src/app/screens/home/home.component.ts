import { Component } from '@angular/core';
import { ClockWeatherComponent } from '../../widgets/clock-weather/clock-weather.component';

@Component({
  selector: 'ksk-home',
  imports: [ClockWeatherComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
