import { Component, computed, input } from '@angular/core';
import { BusStatus } from '@csss-api';
import { DepartureInfo } from '../../../api/translink/translink.service';
import { BusTimePipe } from '../bus-time.pipe';

type DepartureStatusVariant = 'arrived' | 'cancelled' | 'delayed' | 'early' | 'normal';

interface DepartureStatusDetails {
  text: string;
  variant: DepartureStatusVariant;
}

@Component({
  selector: 'ksk-bus-departure-card',
  imports: [BusTimePipe],
  templateUrl: './bus-departure-card.component.html',
  styleUrl: './bus-departure-card.component.scss'
})
export class BusDepartureCardComponent {
  readonly departure = input.required<DepartureInfo>();

  protected readonly statusDetails = computed<DepartureStatusDetails>(() => {
    const departure = this.departure();
    const delaySeconds = departure.delaySeconds;
    const delayMinutes = Math.ceil(Math.abs(delaySeconds) / 60);

    if (departure.status === BusStatus.NUMBER_4) {
      return {
        text: 'Cancelled',
        variant: 'cancelled'
      };
    }

    if (departure.arrived) {
      return {
        text: 'Arrived',
        variant: 'arrived'
      };
    }

    if (delaySeconds < 0) {
      return {
        text: `Early: ${delayMinutes} min`,
        variant: 'early'
      };
    }

    if (delaySeconds > 0 || departure.status === BusStatus.NUMBER_2) {
      return {
        text: `Delayed: ${delayMinutes} min`,
        variant: 'delayed'
      };
    }

    return {
      text: 'On time',
      variant: 'normal'
    };
  });
}
