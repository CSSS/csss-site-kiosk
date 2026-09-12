import { Component, inject, input } from '@angular/core';
import { ModalService } from '@core/modal/modal.service';
import { BusStatus } from '@csss-api';
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
  readonly departures = input<DepartureInfo[]>([]);

  private readonly modal = inject(ModalService);

  protected getDisplayTime(timeDiff: number): string {
    const time = Math.ceil(timeDiff / 60);

    return time < 1 ? '< 1' : time.toString();
  }

  protected getStatusClass(departure?: DepartureInfo): string {
    if (!departure) {
      return STATUS_COLOUR_MAP[BusStatus.NUMBER_3];
    }
    if (departure.arrived) {
      return STATUS_COLOUR_MAP[BusStatus.NUMBER_1];
    }
    return STATUS_COLOUR_MAP[departure.status];
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
