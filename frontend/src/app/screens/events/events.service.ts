import { inject, Service } from '@angular/core';
import { EventService as CsssEventApi } from '@csss-api';
import { map, Observable } from 'rxjs';
import { ObservableCache } from '../../api/observable-cache';
import { KioskEvent } from './event.types';

const ONE_MINUTE = 60 * 1000;

type EventScope = 'all' | 'current';

@Service()
export class EventsService {
  private readonly eventApi = inject(CsssEventApi);

  private readonly cache = new ObservableCache();

  getCurrentEvents(): Observable<KioskEvent[]> {
    return this.getEvents('current');
  }

  getAllEvents(): Observable<KioskEvent[]> {
    return this.getEvents('all');
  }

  getEvents(scope: EventScope): Observable<KioskEvent[]> {
    return this.cache.get<KioskEvent[]>(
      'all',
      () =>
        this.eventApi.getEvents(scope === 'current' ? { current: true } : undefined).pipe(
          map(events =>
            events.map(event => {
              const start = new Date(event.start_datetime);
              const end = new Date(event.end_datetime);

              return new KioskEvent(event, start, end);
            })
          )
        ),
      ONE_MINUTE
    );
  }
}
