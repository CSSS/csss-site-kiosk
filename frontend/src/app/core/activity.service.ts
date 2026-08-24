import { inject, Service } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent, merge, startWith, switchMap, throttleTime, timer } from 'rxjs';

const INACTIVITY_TIMEOUT = 1000 * 60 * 5; // 5 minutes

@Service()
export class ActivityService {
  router = inject(Router);

  constructor() {
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
