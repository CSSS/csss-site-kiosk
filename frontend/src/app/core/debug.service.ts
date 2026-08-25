import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { BUILD_VERSION } from '../app.version';

export const HEALTH_POLL_INTERVAL = 15 * 1000; // 15 seconds

@Service()
export class DebugService {
  http = inject(HttpClient);

  constructor() {
    timer(HEALTH_POLL_INTERVAL, HEALTH_POLL_INTERVAL)
      .pipe(switchMap(() => this.http.get('/health', { responseType: 'text' })))
      .subscribe(version => {
        if (BUILD_VERSION !== version) {
          window.location.reload();
        }
      });
  }
}
