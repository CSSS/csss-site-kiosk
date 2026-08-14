import { OnDestroy, Service, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, Observable, shareReplay } from 'rxjs';

const MINUTE_IN_MS = 60_000;

@Service()
export class TimeService implements OnDestroy {
  private _timeoutId?: number;

  private readonly _now = signal(new Date());

  readonly currentTime = this._now.asReadonly();

  readonly minuteTick$: Observable<number> = toObservable(this._now).pipe(
    map(time => Math.floor(time.getTime() / MINUTE_IN_MS)),
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
