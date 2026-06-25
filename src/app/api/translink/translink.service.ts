import { inject, Service } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { IANA_TIMEZONE, LOCALE } from '../../app.config';
import type { TransLinkScheduleResponse, TransLinkStaticResponse } from '../generated/csss-backend';
import { TranslinkService as TranslinkApiService } from '../generated/csss-backend/api/translink.service';
import { ObservableCache } from '../observable-cache';

const MIDNIGHT = 24 * 60 * 60 * 1000;
const MINUTE_AND_A_HALF = 90 * 1000;
const STATIC_CACHE_KEY = 'static';
const REALTIME_CACHE_KEY = 'realtime';

@Service()
export class TranslinkService {
  private translinkApi = inject(TranslinkApiService);

  private cache = new ObservableCache();

  getDepartureSchedule(): Observable<TransLinkScheduleResponse[]> {
    return this.cache.get<TransLinkScheduleResponse[]>(
      REALTIME_CACHE_KEY,
      () => this.translinkApi.getDepartureSchedule(),
      MINUTE_AND_A_HALF
    );
  }

  getNextDepartures(): Observable<Map<string, TransLinkScheduleResponse>> {
    return this.getDepartureSchedule().pipe(
      map(schedules => {
        const result = new Map<string, TransLinkScheduleResponse>();

        for (const schedule of schedules) {
          if (result.has(schedule.route_number)) {
            // We assume that the routes are sorted from soonest departure time to latest
            continue;
          }

          result.set(schedule.route_number, schedule);
        }

        return result;
      })
    );
  }

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
