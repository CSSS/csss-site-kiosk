import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClassLookup } from './screens/class-lookup/class-lookup.component';

@Component({
  selector: 'ksk-root',
  imports: [RouterOutlet, ClassLookup],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('csss-kiosk-site');
}
