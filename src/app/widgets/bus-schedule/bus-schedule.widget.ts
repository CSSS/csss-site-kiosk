import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, of, shareReplay, switchMap, timer } from 'rxjs';
import { BusStatus, type TransLinkScheduleResponse } from '../../api/generated/csss-backend';
import { TranslinkService } from '../../api/translink/translink.service';
import { TimeService } from '../../core/time.service';

const ONE_MINUTE = 1000 * 60;
const TWO_MINUTES = ONE_MINUTE * 2;

interface DepartureInfo {
  routeNumber: string;
  secondsUntilDeparture: number;
  status: string;
}

// TODO: Fix the enum values on the backend and regenerate the services to get better enum names
const STATUS_COLOUR_MAP: Record<number, string> = {
  [BusStatus.NUMBER_1]: 'status--arrived',
  [BusStatus.NUMBER_2]: 'status--delayed',
  [BusStatus.NUMBER_3]: 'status--on-time',
  [BusStatus.NUMBER_4]: 'status--cancelled'
};

@Component({
  selector: 'ksk-bus-schedule-widget',
  imports: [DecimalPipe],
  templateUrl: './bus-schedule.widget.html',
  styleUrl: './bus-schedule.widget.scss'
})
export class BusScheduleWidget {
  private translinkService = inject(TranslinkService);
  private timeService = inject(TimeService);

  routesToTrack = ['R5', '143', '144', '145'];

  private pollDepartures$ = timer(0, TWO_MINUTES).pipe(
    switchMap(() =>
      this.translinkService.getNextDepartures().pipe(
        catchError(error => {
          console.error('Error while polling departures:', error);
          return of(new Map<string, TransLinkScheduleResponse>());
        })
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true, windowTime: TWO_MINUTES })
  );

  protected nextDepartures = toSignal(
    combineLatest([this.pollDepartures$, timer(0, ONE_MINUTE)]).pipe(
      map(([res]) => {
        const now = this.timeService.currentTime();
        const result = new Map<string, DepartureInfo[]>([
          ['R5', []],
          ['143', []],
          ['144', []],
          ['145', []]
        ]);
        for (const departure of res.values()) {
          const departList = result.get(departure.route_number);
          if (!departList) {
            console.error(`Route ${departure.route_number} is not being tracked.`);
            continue;
          }
          departList.push({
            routeNumber: departure.route_number,
            secondsUntilDeparture: Math.floor(
              departure.scheduled_departure_time - now.getTime() / 1000
            ),
            status: STATUS_COLOUR_MAP[departure.status]
          });
        }
        return result;
      })
    ),
    {
      initialValue: new Map<string, DepartureInfo[]>([
        ['R5', []],
        ['143', []],
        ['144', []],
        ['145', []]
      ])
    }
  );

  protected getDisplayTime(timeDiff: number): number {
    if (timeDiff < 60) {
      return 1;
    }

    return Math.floor(timeDiff / 60);
  }
}
