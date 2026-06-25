import { Service, signal } from '@angular/core';

@Service()
export class TimeService {
  private _now = signal(new Date());

  readonly currentTime = this._now.asReadonly();

  constructor() {
    setInterval(() => this._now.set(new Date()), 1000);
  }
}
