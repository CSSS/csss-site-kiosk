import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, of, shareReplay, switchMap, timer } from 'rxjs';
import { DepartureInfo, TranslinkService } from '../../api/translink/translink.service';
import { TimeService } from '../../core/time.service';
import { ScheduleDisplayComponent } from './schedule-display/schedule-display.component';

const ONE_MINUTE = 1000 * 60;
const TWO_MINUTES = ONE_MINUTE * 2;

@Component({
  selector: 'ksk-bus-schedule-widget',
  imports: [ScheduleDisplayComponent],
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
          return of(new Map<string, DepartureInfo[]>());
        })
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true, windowTime: TWO_MINUTES })
  );

  protected nextDepartures = toSignal(
    combineLatest([this.pollDepartures$, timer(0, ONE_MINUTE)]).pipe(
      map(([res]) => {
        console.log(res);
        const result = this.routesToTrack.reduce((acc, route) => {
          acc.set(route, res.get(route) || []);
          return acc;
        }, new Map<string, DepartureInfo[]>());
        console.log(result);
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
}
