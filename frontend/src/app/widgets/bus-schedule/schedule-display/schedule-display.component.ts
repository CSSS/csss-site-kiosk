import { Component, inject, input } from '@angular/core';
import { ModalService } from '@core/modal/modal.service';
import { DepartureInfo } from '../../../api/translink/translink.service';
import { BusScheduleModalComponent } from '../bus-schedule-modal/bus-schedule-modal.component';
import { STATUS_COLOUR_MAP } from '../bus-utils';

@Component({
  selector: 'ksk-schedule-display',
  templateUrl: './schedule-display.component.html',
  styleUrl: './schedule-display.component.scss'
})
export class ScheduleDisplayComponent {
  readonly routeNumber = input.required<string>();
  readonly departures = input<DepartureInfo[]>();

  private readonly modal = inject(ModalService);

  protected getDisplayTime(timeDiff: number): number {
    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  }

  protected getStatusClass(status?: number): string {
    return status ? STATUS_COLOUR_MAP[status] : '';
  }

  protected openScheduleModal(): void {
    this.modal.open({
      type: 'component',
      title: `Route ${this.routeNumber()} departures`,
      content: BusScheduleModalComponent,
      inputs: {
        routeNumber: this.routeNumber(),
        departures: this.departures() ?? []
      },
      layout: {
        padding: '0',
        showTitle: false
      }
    });
  }
}
