import { computed, inject, Service, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TimeService } from '@core/time.service';
import { EventService as CsssEventApi } from '@csss-api';
import { map, Observable, switchMap } from 'rxjs';
import { ObservableCache } from '../../api/observable-cache';
import { KioskEvent } from './event.types';

const ONE_MINUTE = 60 * 1000;

@Service()
export class EventsService {
  private readonly eventApi = inject(CsssEventApi);

  private readonly timeService = inject(TimeService);

  private readonly cache = new ObservableCache();

  loadedEvents = signal(new Map<number, KioskEvent>());

  private readonly eventPoll$ = this.timeService.minuteTick$.pipe(
    switchMap(() => this.getEvents())
  );

  events = toSignal(this.eventPoll$, { initialValue: [] });

  currentEvents = computed(() => {
    // Untracked so this doesn't keep filtering the current events.
    const currentTime = untracked(() => this.timeService.currentDatetime());
    return this.events().filter(event => event.endDatetime > currentTime);
  });

  getEvents(): Observable<KioskEvent[]> {
    return this.cache.get<KioskEvent[]>(
      'events',
      () =>
        this.eventApi.getEvents().pipe(
          map(events =>
            events.map(event => {
              const start = new Date(event.start_datetime);
              const end = new Date(event.end_datetime);

              return new KioskEvent(event, start, end);
            })
          )
        ),
      ONE_MINUTE / 2
    );
  }
}
