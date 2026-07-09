import { OnDestroy, Service, signal } from '@angular/core';

@Service()
export class TimeService implements OnDestroy {
  private readonly _now = signal(new Date());
  private _timeoutId?: number;

  readonly currentTime = this._now.asReadonly();

  constructor() {
    this.tick();
  }

  ngOnDestroy(): void {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
  }

  private tick(): void {
    const delay = 1000 - (Date.now() % 1000);
    this._timeoutId = setTimeout(() => {
      this._now.set(new Date());
      this.tick();
    }, delay);
  }
}
