import { HttpClient } from '@angular/common/http';
import { inject, Injector, OnInit, Service, signal } from '@angular/core';
import type { KioskVersion } from '@csss-kiosk/shared';
import { firstValueFrom, map, type Observable, switchMap, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BUILD_VERSION } from '../../app.version';

export const HEALTH_POLL_INTERVAL = 15 * 1000; // 15 seconds

@Service()
export class DebugService implements OnInit {
  private readonly http = inject(HttpClient);

  private readonly injector = inject(Injector);

  readonly serverVersion$: Observable<KioskVersion> = this.http.get('/health', {
    responseType: 'text'
  });

  readonly latestReleaseVersion = signal('');

  constructor() {
    if (!environment.production) {
      return;
    }

    timer(HEALTH_POLL_INTERVAL, HEALTH_POLL_INTERVAL)
      .pipe(switchMap(() => this.serverVersion$))
      .subscribe(version => {
        if (BUILD_VERSION !== version) {
          window.location.reload();
        }
      });
  }

  async ngOnInit(): Promise<void> {
    await this.getLatestReleaseVersion();
  }

  async openDebugModal(): Promise<void> {
    // Optimization: Reduced the initial bundle size by about 88kB.
    const [{ DebugModal }, { ModalService }] = await Promise.all([
      import('@widgets/debug-panel/debug.modal'),
      import('@core/modal/modal.service')
    ]);
    const modal = this.injector.get(ModalService);
    modal.open({
      type: 'component',
      title: 'Debug Panel',
      content: DebugModal
    });
  }

  async getLatestReleaseVersion(): Promise<void> {
    const res = await firstValueFrom(
      this.http
        .get<{ tag_name: string }>(
          'https://api.github.com/repos/CSSS/csss-site-kiosk/releases/latest'
        )
        .pipe(map(res => res.tag_name))
    );
    this.latestReleaseVersion.set(res);
  }
}
