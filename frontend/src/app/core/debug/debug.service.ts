import { HttpClient } from '@angular/common/http';
import { inject, Injector, Service } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ServerHealth } from '@csss-kiosk/shared';
import { filter, map, switchMap, take, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BUILD_VERSION } from '../../app.version';

export const HEALTH_POLL_INTERVAL = 15 * 1000; // 15 seconds

@Service()
export class DebugService {
  private readonly http = inject(HttpClient);

  private readonly injector = inject(Injector);

  private readonly healthRequest$ = this.http.get<ServerHealth>('/health');

  readonly serverInfo = toSignal(this.healthRequest$, {
    initialValue: {
      version: '',
      startedAt: 0
    }
  });

  protected readonly route = inject(ActivatedRoute);

  protected readonly router = inject(Router);

  readonly latestReleaseVersion = rxResource({
    stream: () =>
      this.http
        .get<{ tag_name: string }>(
          'https://api.github.com/repos/CSSS/csss-site-kiosk/releases/latest'
        )
        .pipe(map(res => res.tag_name))
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        const debugParam = this.route.snapshot.queryParamMap.get('debug');

        if (debugParam === '1') {
          this.openDebugModal();
        }
      });

    if (!environment.production) {
      return;
    }

    timer(HEALTH_POLL_INTERVAL, HEALTH_POLL_INTERVAL)
      .pipe(switchMap(() => this.healthRequest$))
      .subscribe(res => {
        if (BUILD_VERSION !== res.version) {
          window.location.reload();
        }
      });
  }

  async openDebugModal(): Promise<void> {
    // Optimization: Reduced the initial bundle size by about 88kB.
    const [{ DebugModal }, { ModalService }] = await Promise.all([
      import('@widgets/debug-panel/debug.modal'),
      import('@core/modal/modal.service')
    ]);

    // This adds a query parameter of debug=true
    // so that refreshing the page will open the dialog.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { debug: 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    const dialogRef = this.injector.get(ModalService).open({
      type: 'component',
      title: 'Debug Panel',
      content: DebugModal
    });

    dialogRef.afterClosed.subscribe(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { debug: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }
}
