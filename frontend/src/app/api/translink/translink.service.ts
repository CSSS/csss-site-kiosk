import { inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeService } from '@core/time.service';
import { KioskService as TranslinkApiService, type TransLinkScheduleResponse } from '@csss-api';
import { catchError, map, of, switchMap, type Observable } from 'rxjs';
import { ObservableCache } from '../observable-cache';

export interface DepartureInfo {
  routeNumber: string;
  secondsUntilDeparture: number;
  delaySeconds: number;
  status: number;
}

const MIDNIGHT = 24 * 60 * 60 * 1000;
const MINUTE_AND_A_HALF = 90 * 1000;
const STATIC_CACHE_KEY = 'static';
const REALTIME_CACHE_KEY = 'realtime';

@Service()
export class TranslinkService {
  private translinkApi = inject(TranslinkApiService);

  private timeService = inject(TimeService);

  routesToTrack = ['R5', '143', '144', '145'];

  private cache = new ObservableCache();

  nextDepartures = toSignal(
    this.timeService.minuteTick$.pipe(
      switchMap(() =>
        this.getNextDepartures().pipe(
          catchError(error => {
            console.error('Error while polling departures:', error);
            return of(new Map<string, DepartureInfo[]>());
          })
        )
      ),
      map(res => {
        return this.routesToTrack.reduce(
          (acc, route) => {
            acc.set(route, res.get(route) || []);
            return acc;
          },
          new Map<string, DepartureInfo[]>(this.routesToTrack.map(route => [route, []]))
        );
      })
    ),
    {
      initialValue: new Map<string, DepartureInfo[]>(this.routesToTrack.map(route => [route, []]))
    }
  );

  getDepartureSchedule(): Observable<TransLinkScheduleResponse[]> {
    return this.cache.get<TransLinkScheduleResponse[]>(
      REALTIME_CACHE_KEY,
      () => this.translinkApi.getDepartureSchedule(),
      MINUTE_AND_A_HALF
    );
  }

  /**
   * Retrieves the next 3 departures for each bus route.
   *
   * @returns An observable map of route numbers with their schedule information.
   */
  getNextDepartures(): Observable<Map<string, DepartureInfo[]>> {
    return this.getDepartureSchedule().pipe(
      map(departures => {
        const result = new Map<string, DepartureInfo[]>();

        for (const departure of departures) {
          const departList = result.get(departure.route_number) ?? [];
          departList.push({
            routeNumber: departure.route_number,
            secondsUntilDeparture: Math.floor(
              departure.scheduled_departure_time -
                this.timeService.currentDatetime().getTime() / 1000
            ),
            delaySeconds: departure.delay_seconds,
            status: departure.status
          });
          result.set(departure.route_number, departList);
        }

        return result;
      })
    );
  }
}
