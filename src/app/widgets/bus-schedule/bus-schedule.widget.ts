import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { TranslinkService } from '../../api/translink/translink.service';
import { TimeService } from '../../core/time.service';

const TWO_MINUTES = 1000 * 60 * 2;

interface DepartureInfo {
  routeNumber: string;
  secondsUntilDeparture: number;
}

@Component({
  selector: 'ksk-bus-schedule-widget',
  imports: [DecimalPipe],
  templateUrl: './bus-schedule.widget.html',
  styleUrl: './bus-schedule.widget.scss'
})
export class BusScheduleWidget {
  private translinkService = inject(TranslinkService);
  private timeService = inject(TimeService);

  nextDepartures = toSignal(
    timer(0, TWO_MINUTES).pipe(
      switchMap(() =>
        this.translinkService.getNextDepartures().pipe(
          map(res => {
            const now = this.timeService.currentTime();
            const result: DepartureInfo[] = [];
            for (const departure of res.values()) {
              result.push({
                routeNumber: departure.route_number,
                secondsUntilDeparture: Math.floor(
                  departure.scheduled_departure_time - now.getTime() / 1000
                )
              });
            }
            return result;
          }),
          catchError(error => {
            console.error('Error while polling departures:', error);
            return of([] as DepartureInfo[]);
          })
        )
      )
    ),
    { initialValue: [] }
  );

  protected getDisplayTime(timeDiff: number): string {
    if (timeDiff < 60) {
      return '<1 minute';
    }

    let minutes = Math.floor(timeDiff / 60);
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours} hr ${minutes} min`;
  }
}
