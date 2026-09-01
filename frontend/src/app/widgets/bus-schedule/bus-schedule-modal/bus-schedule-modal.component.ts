import { Component, computed, inject, signal } from '@angular/core';
import { LucideX } from '@lucide/angular';
import {
  NgpDialog,
  NgpDialogOverlay,
  NgpDialogRef,
  provideDialogState
} from 'ng-primitives/dialog';
import { DepartureInfo } from '../../../api/translink/translink.service';
import { BusDepartureCardComponent } from '../bus-departure-card/bus-departure-card.component';

export interface BusScheduleModalData {
  routeNumber: string;
  departures: DepartureInfo[];
}

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
  hostDirectives: [NgpDialogOverlay],
  imports: [LucideX, NgpDialog, BusDepartureCardComponent],
  providers: [provideDialogState()],
  templateUrl: './bus-schedule-modal.component.html',
  styleUrl: './bus-schedule-modal.component.scss'
})
export class BusScheduleModalComponent {
  private readonly dialogRef = inject<NgpDialogRef<BusScheduleModalData>>(NgpDialogRef);

  protected readonly routeNumber = signal(this.dialogRef.data.routeNumber);

  protected readonly departures = signal(this.dialogRef.data.departures);

  protected readonly routeDetails = computed(
    () => routeDetails[this.routeNumber()] ?? fallbackRoute
  );

  protected readonly nextDeparture = computed(() => this.departures().at(0));

  protected readonly upcomingDepartures = computed(() => this.departures().slice(1));

  protected closeScheduleModal(): void {
    this.dialogRef.close();
  }
}
