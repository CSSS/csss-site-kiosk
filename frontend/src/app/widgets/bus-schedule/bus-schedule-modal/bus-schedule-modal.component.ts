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
  location: string;
  destination: string;
}

const fallbackRoute: BusRouteDetails = {
  location: 'Upper Bus Loop',
  destination: 'Destination unavailable'
};

const routeDetails: Record<string, BusRouteDetails> = {
  R5: {
    location: 'Platform 2',
    destination: 'Hastings St to Burrard Station'
  },
  '143': {
    location: 'Platform 2',
    destination: 'Burquitlam Station'
  },
  '144': {
    location: 'Platform 2',
    destination: 'Metrotown Station'
  },
  '145': {
    location: 'Platform 2',
    destination: 'Production Way-University Station'
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
