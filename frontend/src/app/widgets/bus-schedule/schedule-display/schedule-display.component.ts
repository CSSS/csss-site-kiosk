import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ModalService } from '@core/modal/modal.service';
import { BusStatus } from '@csss-api';
import { DepartureInfo } from '../../../api/translink/translink.service';
import { BusScheduleModalComponent } from '../bus-schedule-modal/bus-schedule-modal.component';

// TODO: Fix the enum values on the backend and regenerate the services to get better enum names
const STATUS_COLOUR_MAP: Record<number, string> = {
  [BusStatus.NUMBER_1]: 'status--arrived',
  [BusStatus.NUMBER_2]: 'status--delayed',
  [BusStatus.NUMBER_3]: 'status--on-time',
  [BusStatus.NUMBER_4]: 'status--cancelled'
};

@Component({
  selector: 'ksk-schedule-display',
  imports: [DecimalPipe],
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
    return status ? STATUS_COLOUR_MAP[status] : 'status';
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
