import { DecimalPipe } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { BusStatus } from 'csss-api';
import { DepartureInfo } from '../../../api/translink/translink.service';

const DROPDOWN_TIMEOUT_MS = 3000;

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
  protected readonly isDropdownOpen = signal(false);
  private timeoutId?: number;

  constructor() {
    effect(() => {
      if (this.isDropdownOpen()) {
        this.timeoutId = setTimeout(() => {
          this.isDropdownOpen.update(value => !value);
        }, DROPDOWN_TIMEOUT_MS);
      } else if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  protected getDisplayTime(timeDiff: number): number {
    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  }

  protected getStatusClass(status?: number): string {
    return status ? STATUS_COLOUR_MAP[status] : 'status';
  }
}
