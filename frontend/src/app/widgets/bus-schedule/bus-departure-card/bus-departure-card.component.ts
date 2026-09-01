import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DepartureInfo } from '../../../api/translink/translink.service';

@Component({
  selector: 'ksk-bus-departure-card',
  imports: [DecimalPipe],
  templateUrl: './bus-departure-card.component.html',
  styleUrl: './bus-departure-card.component.scss'
})
export class BusDepartureCardComponent {
  readonly departure = input.required<DepartureInfo>();

  readonly location = input.required<string>();

  readonly destination = input.required<string>();

  protected readonly displayTime = computed(() => {
    const timeDiff = this.departure().secondsUntilDeparture;

    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  });
}
