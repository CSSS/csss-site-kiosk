import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideX } from '@lucide/angular';
import {
  NgpDialog,
  NgpDialogOverlay,
  NgpDialogRef,
  provideDialogState
} from 'ng-primitives/dialog';
import { DepartureInfo } from '../../../api/translink/translink.service';

export interface BusScheduleModalData {
  routeNumber: string;
  departures: DepartureInfo[];
}

@Component({
  selector: 'ksk-bus-schedule-modal',
  hostDirectives: [NgpDialogOverlay],
  imports: [DecimalPipe, LucideX, NgpDialog],
  providers: [provideDialogState()],
  templateUrl: './bus-schedule-modal.component.html',
  styleUrl: './bus-schedule-modal.component.scss'
})
export class BusScheduleModalComponent {
  private readonly dialogRef = inject<NgpDialogRef<BusScheduleModalData>>(NgpDialogRef);

  protected readonly routeNumber = signal(this.dialogRef.data.routeNumber);

  protected readonly departures = signal(this.dialogRef.data.departures);

  protected readonly upcomingDepartures = computed(() => this.departures().slice(1));

  protected getDisplayTime(timeDiff: number): number {
    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  }

  protected closeScheduleModal(): void {
    this.dialogRef.close();
  }
}
