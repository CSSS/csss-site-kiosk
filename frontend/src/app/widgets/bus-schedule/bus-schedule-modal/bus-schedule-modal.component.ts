import { Component, computed, input } from '@angular/core';
import { DepartureInfo } from '../../../api/translink/translink.service';
import { BusDepartureCardComponent } from '../bus-departure-card/bus-departure-card.component';

interface BusRouteDetails {
  destination: string;
  platform: string;
}

const fallbackRoute: BusRouteDetails = {
  destination: 'Destination unavailable',
  platform: 'Upper Bus Loop'
};

const routeDetails: Record<string, BusRouteDetails> = {
  R5: {
    destination: 'Hastings St to Burrard Station',
    platform: 'Platform 2'
  },
  '143': {
    destination: 'Burquitlam Station',
    platform: 'Platform 2'
  },
  '144': {
    destination: 'Metrotown Station',
    platform: 'Platform 2'
  },
  '145': {
    destination: 'Production Way-University Station',
    platform: 'Platform 2'
  }
};

@Component({
  selector: 'ksk-bus-schedule-modal',
  imports: [BusDepartureCardComponent],
  templateUrl: './bus-schedule-modal.component.html',
  styleUrl: './bus-schedule-modal.component.scss'
})
export class BusScheduleModalComponent {
  readonly routeNumber = input.required<string>();
  readonly departures = input.required<DepartureInfo[]>();

  protected readonly routeDetails = computed(
    () => routeDetails[this.routeNumber()] ?? fallbackRoute
  );

  protected readonly nextDeparture = computed(() => this.departures().at(0));

  protected readonly upcomingDepartures = computed(() => this.departures().slice(1));
}
