import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeService } from '@core/time.service';
import { ScheduleDisplayComponent } from '@widgets/bus-schedule/schedule-display/schedule-display.component';
import { catchError, combineLatest, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { DepartureInfo, TranslinkService } from '../../api/translink/translink.service';

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

  /**
   * Polls the TransLink endpoint roughly every 2 minutes.
   */
  private pollDepartures$ = this.timeService.minuteTick$.pipe(
    // Polls on every other minute tick
    filter((_, index) => index % 2 === 0),
    switchMap(() =>
      this.translinkService.getNextDepartures().pipe(
        catchError(error => {
          console.error('Error while polling departures:', error);
          return of(new Map<string, DepartureInfo[]>());
        })
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Grabs the departure info and sets it on the UI.
   */
  protected nextDepartures = toSignal(
    combineLatest([this.pollDepartures$, this.timeService.minuteTick$]).pipe(
      map(([res]) => {
        return this.routesToTrack.reduce((acc, route) => {
          acc.set(route, res.get(route) || []);
          return acc;
        }, new Map<string, DepartureInfo[]>());
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
