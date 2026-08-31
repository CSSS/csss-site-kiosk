import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DebugService, HEALTH_POLL_INTERVAL } from '@core/debug/debug.service';
import { BUILD_VERSION } from '../../app.version';

describe('DebugService', () => {
  const reload = vi.fn();
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('location', {
      ...window.location,
      reload: reload
    });
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), DebugService]
    });
    httpTesting = TestBed.inject(HttpTestingController);
    TestBed.inject(DebugService);
  });

  afterEach(() => {
    httpTesting.verify();
    TestBed.resetTestingModule();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    reload.mockClear();
  });

  it('reloads on version mismatch', () => {
    vi.advanceTimersByTime(HEALTH_POLL_INTERVAL);

    const request = httpTesting.expectOne('/health');
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('application/json');
    request.flush('new-version');

    expect(reload).toHaveBeenCalledOnce();
  });

  it('does not reload on version match', () => {
    vi.advanceTimersByTime(HEALTH_POLL_INTERVAL);

    const request = httpTesting.expectOne('/health');
    request.flush({
      version: BUILD_VERSION,
      startedAT: Date.now()
    });

    expect(reload).not.toHaveBeenCalled();
  });
});
