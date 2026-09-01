import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { BusStatus } from '@csss-api';
import { DepartureInfo } from '../../../api/translink/translink.service';

type DepartureStatusVariant = 'arrived' | 'cancelled' | 'delayed' | 'early' | 'on-time';

interface DepartureStatusDetails {
  text: string;
  variant: DepartureStatusVariant;
}

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

  readonly delaySeconds = input<number>();

  protected readonly displayTime = computed(() => {
    const timeDiff = this.departure().secondsUntilDeparture;

    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  });

  protected readonly statusDetails = computed<DepartureStatusDetails>(() => {
    const departure = this.departure();
    const delaySeconds = this.delaySeconds();
    const delayMinutes =
      delaySeconds === undefined ? undefined : Math.ceil(Math.abs(delaySeconds) / 60);

    if (departure.status === BusStatus.NUMBER_4) {
      return {
        text: 'Cancelled',
        variant: 'cancelled'
      };
    }

    if (departure.status === BusStatus.NUMBER_1) {
      return {
        text: 'Arrived',
        variant: 'arrived'
      };
    }

    if (delaySeconds !== undefined && delaySeconds < 0) {
      return {
        text: `Early: ${delayMinutes} min`,
        variant: 'early'
      };
    }

    if (
      (delaySeconds !== undefined && delaySeconds > 0) ||
      departure.status === BusStatus.NUMBER_2
    ) {
      return {
        text: delayMinutes === undefined ? 'Delayed' : `Delayed: ${delayMinutes} min`,
        variant: 'delayed'
      };
    }

    return {
      text: 'On time',
      variant: 'on-time'
    };
  });
}
