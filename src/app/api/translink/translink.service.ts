import { inject, Service } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { IANA_TIMEZONE, LOCALE } from '../../config';
import { TimeService } from '../../core/time.service';
import {
  type TransLinkScheduleResponse,
  type TransLinkStaticResponse
} from '../generated/csss-backend';
import { TranslinkService as TranslinkApiService } from '../generated/csss-backend/api/translink.service';
import { ObservableCache } from '../observable-cache';

export interface DepartureInfo {
  routeNumber: string;
  secondsUntilDeparture: number;
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

  private cache = new ObservableCache();

  getDepartureSchedule(): Observable<TransLinkScheduleResponse[]> {
    return this.cache.get<TransLinkScheduleResponse[]>(
      REALTIME_CACHE_KEY,
      () => this.translinkApi.getDepartureSchedule(),
      MINUTE_AND_A_HALF
    );
  }

  /**
   * Retrieves the next departure for each bus route.
   *
   * @returns An observable map of route numbers with their schedule information.
   */
  getNextDepartures(): Observable<Map<string, DepartureInfo[]>> {
    return this.getDepartureSchedule().pipe(
      map(departures => {
        console.log(departures);
        const result = new Map<string, DepartureInfo[]>();

        for (const departure of departures) {
          const departList = result.get(departure.route_number) ?? [];
          departList.push({
            routeNumber: departure.route_number,
            secondsUntilDeparture: Math.floor(
              departure.scheduled_departure_time - this.timeService.currentTime().getTime() / 1000
            ),
            status: departure.status
          });
          result.set(departure.route_number, departList);
        }

        console.log(result);
        return result;
      })
    );
  }

  /**
   * Retrieves the static schedule for desired bus routes.
   *
   * @returns an observable of the static schedule response, which is cached until midnight in Vancouver time
   */
  getStaticSchedule(): Observable<TransLinkStaticResponse> {
    const now = new Date();
    const vancouverTimeStr = now.toLocaleString(LOCALE, {
      timeZone: IANA_TIMEZONE,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3
    });

    const [hours, minutes, seconds, ms] = vancouverTimeStr.split(/[:.]/).map(Number);

    const msPassedToday = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + ms;
    const msUntilMidnight = MIDNIGHT - msPassedToday;

    return this.cache.get<TransLinkStaticResponse>(
      STATIC_CACHE_KEY,
      () => this.translinkApi.getStaticSchedule(),
      msUntilMidnight
    );
  }
}
