import { inject, Service } from '@angular/core';
import type { Observable } from 'rxjs';
import { IANA_TIMEZONE, LOCALE } from '../../app.config';
import type {
  TransLinkRealtimeResponse,
  TransLinkScheduleResponse
} from '../generated/csss-backend';
import { TranslinkService as TranslinkApiService } from '../generated/csss-backend/api/translink.service';
import { ObservableCache } from '../observable-cache';

const MIDNIGHT = 24 * 60 * 60 * 1000;
const TWO_MINUTES = 1000 * 60 * 2;
const STATIC_CACHE_KEY = 'static';
const REALTIME_CACHE_KEY = 'realtime';

@Service()
export class TranslinkService {
  private translinkApi = inject(TranslinkApiService);

  private cache = new ObservableCache();

  getRealtimeData(): Observable<TransLinkRealtimeResponse[]> {
    return this.cache.get<TransLinkRealtimeResponse[]>(
      REALTIME_CACHE_KEY,
      this.translinkApi.getRealtimeSchedule,
      TWO_MINUTES
    );
  }

  getStaticSchedule(): Observable<TransLinkScheduleResponse[]> {
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

    return this.cache.get<TransLinkScheduleResponse[]>(
      STATIC_CACHE_KEY,
      this.translinkApi.getDepartureSchedule,
      msUntilMidnight
    );
  }
}
