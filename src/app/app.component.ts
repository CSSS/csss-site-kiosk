import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClassLookupComponent } from './screens/class-lookup/class-lookup.screen';

@Component({
  selector: 'ksk-root',
  imports: [RouterOutlet, ClassLookupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('csss-kiosk-site');
}
