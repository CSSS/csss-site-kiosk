import { inject, Service } from '@angular/core';
import { TimeService } from '@core/time.service';
import { EventService as CsssEventApi } from '@csss-api';
import { map, Observable } from 'rxjs';
import { ObservableCache } from '../../api/observable-cache';
import { KioskEvent } from './event.types';

const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = ONE_MINUTE * 15;

function cacheKey(year: number, month: number): string {
  return year + '-' + month;
}

// TODO: Make this poll so that events are always fresh.
@Service()
export class EventsService {
  private readonly eventApi = inject(CsssEventApi);

  private readonly time = inject(TimeService);

  private readonly cache = new ObservableCache();

  // TODO: Swap this to use the current events endpoint when it's done.
  getCurrentEvents(): Observable<KioskEvent[]> {
    return this.cache.get<KioskEvent[]>(
      'current',
      () =>
        this.eventApi.getAllEvents().pipe(
          map(events => {
            const now = this.time.currentDatetime();
            const result: KioskEvent[] = [];

            for (const e of events) {
              const startTime = new Date(e.start_datetime);
              const endTime = new Date(e.end_datetime);
              if (startTime < now && endTime < now) {
                continue;
              }

              result.push(new KioskEvent(e, startTime, endTime));
            }

            return result.sort((a, b) => a.startDatetime.getTime() - b.startDatetime.getTime());
          })
        ),
      ONE_MINUTE
    );
  }

  getEventsForMonth(year: number, month: number): Observable<KioskEvent[]> {
    return this.cache.get<KioskEvent[]>(
      cacheKey(year, month),
      () =>
        this.eventApi
          .getEventsForThisYearMonth(year, month)
          .pipe(
            map(events =>
              events.map(
                e => new KioskEvent(e, new Date(e.start_datetime), new Date(e.end_datetime))
              )
            )
          ),
      FIFTEEN_MINUTES
    );
  }
}
