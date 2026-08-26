import { inject, Service } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent, merge, startWith, switchMap, throttleTime, timer } from 'rxjs';
import { environment } from '../../environments/environment';

export const INACTIVITY_TIMEOUT = 1000 * 60 * 5; // 5 minutes

/**
 * Returns the Kiosk back to the Home page after 5 minutes
 * of inactivity (no mouse movement, no clicks, no key presses).
 */
@Service()
export class ActivityService {
  router = inject(Router);

  constructor() {
    if (!environment.production) {
      return;
    }

    const click$ = fromEvent(document, 'click');
    const touch$ = fromEvent(document, 'touchstart');
    const move$ = fromEvent(document, 'mousemove');
    const key$ = fromEvent(document, 'keydown');

    merge(click$, touch$, move$, key$)
      .pipe(
        throttleTime(1000),
        startWith(null),
        switchMap(() => timer(INACTIVITY_TIMEOUT)),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }
}
