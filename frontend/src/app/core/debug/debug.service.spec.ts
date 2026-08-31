import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, NavigationEnd, Router } from '@angular/router';
import { DebugService, HEALTH_POLL_INTERVAL } from '@core/debug/debug.service';
import { ModalService } from '@core/modal/modal.service';
import { ServerHealth } from '@csss-kiosk/shared';
import { DebugModal } from '@widgets/debug-panel/debug.modal';
import { of, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BUILD_VERSION } from '../../app.version';

describe('DebugService', () => {
  const originalProduction = environment.production;
  const reload = vi.fn();
  const navigate = vi.fn().mockResolvedValue(true);
  const open = vi.fn();

  let afterClosed: Subject<void>;
  let health: Subject<ServerHealth>;
  let route: { snapshot: { queryParamMap: ReturnType<typeof convertToParamMap> } };
  let routerEvents: Subject<NavigationEnd>;
  let service: DebugService;

  beforeEach(() => {
    environment.production = true;
    vi.useFakeTimers();
    reload.mockReset();
    navigate.mockReset().mockResolvedValue(true);
    open.mockReset();

    afterClosed = new Subject<void>();
    health = new Subject<ServerHealth>();
    routerEvents = new Subject<NavigationEnd>();
    route = {
      snapshot: {
        queryParamMap: convertToParamMap({})
      }
    };

    open.mockReturnValue({ afterClosed });

    vi.stubGlobal('location', {
      ...window.location,
      reload
    });

    TestBed.configureTestingModule({
      providers: [
        DebugService,
        {
          provide: HttpClient,
          useValue: {
            get: vi.fn((url: string) => (url === '/health' ? health : of({ tag_name: 'v1.2.3' })))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: route
        },
        {
          provide: Router,
          useValue: {
            events: routerEvents,
            navigate
          }
        },
        {
          provide: ModalService,
          useValue: { open }
        }
      ]
    });

    service = TestBed.inject(DebugService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    environment.production = originalProduction;
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens the debug modal after initial navigation when requested by the URL', () => {
    route.snapshot.queryParamMap = convertToParamMap({ debug: '1' });
    const openDebugModal = vi.spyOn(service, 'openDebugModal').mockResolvedValue();

    routerEvents.next(new NavigationEnd(1, '/?debug=1', '/?debug=1'));

    expect(openDebugModal).toHaveBeenCalledOnce();
  });

  it('does not open the debug modal after initial navigation by default', () => {
    const openDebugModal = vi.spyOn(service, 'openDebugModal').mockResolvedValue();

    routerEvents.next(new NavigationEnd(1, '/', '/'));

    expect(openDebugModal).not.toHaveBeenCalled();
  });

  it('adds the query parameter while open and removes it after closing', async () => {
    await service.openDebugModal();

    expect(navigate).toHaveBeenNthCalledWith(1, [], {
      relativeTo: route,
      queryParams: { debug: 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    expect(open).toHaveBeenCalledWith({
      type: 'component',
      title: 'Debug Panel',
      content: DebugModal
    });

    afterClosed.next();

    expect(navigate).toHaveBeenNthCalledWith(2, [], {
      relativeTo: route,
      queryParams: { debug: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('reloads on version mismatch', () => {
    vi.advanceTimersByTime(HEALTH_POLL_INTERVAL);
    health.next({ version: 'new-version', startedAt: Date.now() });

    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not reload on version match', () => {
    vi.advanceTimersByTime(HEALTH_POLL_INTERVAL);
    health.next({ version: BUILD_VERSION, startedAt: Date.now() });

    expect(reload).not.toHaveBeenCalled();
  });
});
