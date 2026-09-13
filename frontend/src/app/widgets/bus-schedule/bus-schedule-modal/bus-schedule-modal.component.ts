import { Component, computed, inject, input } from '@angular/core';
import { TranslinkService } from '../../../api/translink/translink.service';
import { BusDepartureCardComponent } from '../bus-departure-card/bus-departure-card.component';

interface BusRouteDetails {
  destination: string;
}

const fallbackRoute: BusRouteDetails = {
  destination: 'Destination unavailable'
};

const routeDetails: Record<string, BusRouteDetails> = {
  R5: {
    destination: 'Hastings St to Burrard Station'
  },
  '143': {
    destination: 'Burquitlam Station'
  },
  '144': {
    destination: 'Metrotown Station'
  },
  '145': {
    destination: 'Production Way-University Station'
  }
};

@Component({
  selector: 'ksk-bus-schedule-modal',
  imports: [BusDepartureCardComponent],
  templateUrl: './bus-schedule-modal.component.html',
  styleUrl: './bus-schedule-modal.component.scss'
})
export class BusScheduleModalComponent {
  private readonly translinkService = inject(TranslinkService);
  readonly routeNumber = input.required<string>();

  protected readonly routeDetails = computed(
    () => routeDetails[this.routeNumber()] ?? fallbackRoute
  );

  protected readonly departures = computed(() =>
    this.translinkService.nextDepartures()?.get(this.routeNumber())
  );

  protected readonly nextDeparture = computed(() => this.departures()?.at(0));

  protected readonly upcomingDepartures = computed(() => this.departures()?.slice(1) ?? []);
}
