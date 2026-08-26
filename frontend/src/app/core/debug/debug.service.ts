import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BUILD_VERSION } from '../../app.version';
import { ModalService } from '../modal/modal.service';

export const HEALTH_POLL_INTERVAL = 15 * 1000; // 15 seconds

@Service()
export class DebugService {
  private readonly http = inject(HttpClient);

  private readonly modal = inject(ModalService);

  constructor() {
    if (!environment.production) {
      return;
    }

    timer(HEALTH_POLL_INTERVAL, HEALTH_POLL_INTERVAL)
      .pipe(switchMap(() => this.http.get('/health', { responseType: 'text' })))
      .subscribe(version => {
        if (BUILD_VERSION !== version) {
          window.location.reload();
        }
      });
  }

  openDebugPanel(): void {
    console.log('Open Debug Panel');
  }
}
