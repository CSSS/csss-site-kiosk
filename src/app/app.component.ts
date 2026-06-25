import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClockWeatherWidget } from './widgets/clock-weather/clock-weather.widget';

@Component({
  selector: 'ksk-root',
  imports: [RouterOutlet, ClockWeatherWidget],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('csss-kiosk-site');
}
