import { computed, OnDestroy, Service, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';
import { IANA_TIMEZONE, LOCALE } from '../config';

const MINUTE_IN_MS = 60_000;
const DAY_IN_MS = MINUTE_IN_MS * 60 * 24;
const DAY_FORMATTER = new Intl.DateTimeFormat(LOCALE, {
  timeZone: IANA_TIMEZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

function getDayNumber(time: Date): number {
  const dateParts = DAY_FORMATTER.formatToParts(time);
  const getPart = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(dateParts.find(part => part.type === type)?.value);

  return Math.floor(Date.UTC(getPart('year'), getPart('month') - 1, getPart('day')) / DAY_IN_MS);
}

@Service()
export class TimeService implements OnDestroy {
  private _timeoutId?: number;

  private readonly _now = signal(new Date());

  readonly currentDatetime = this._now.asReadonly();

  readonly currentYear = computed(() => this.currentDatetime().getUTCFullYear());

  readonly startTime = new Date();

  readonly uptime = computed(() => this.currentDatetime().getTime() - this.startTime.getTime());

  readonly minuteTick$: Observable<number> = toObservable(this._now).pipe(
    map(time => Math.floor(time.getTime() / MINUTE_IN_MS)),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly dayTick$: Observable<number> = toObservable(this._now).pipe(
    map(getDayNumber),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor() {
    this.tick();
  }

  ngOnDestroy(): void {
    if (this._timeoutId !== undefined) {
      clearTimeout(this._timeoutId);
    }
  }

  /**
   * Ticks once about every second.
   */
  private tick(): void {
    // Offset here is to ensure we don't jump 2 seconds on the timers.
    // The 5ms is arbitrary, modulate it accordingly.
    const delay = 1000 - (Date.now() % 1000) + 5;
    this._timeoutId = setTimeout(() => {
      this._now.set(new Date());
      this.tick();
    }, delay);
  }
}
