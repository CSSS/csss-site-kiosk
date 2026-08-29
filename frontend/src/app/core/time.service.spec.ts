import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { TimeService } from '@core/time.service';

describe('TimeService', () => {
  let service: TimeService;
  let subscriptions: Subscription[];

  beforeEach(() => {
    vi.useFakeTimers();
    subscriptions = [];
    TestBed.configureTestingModule({ providers: [TimeService] });
  });

  afterEach(() => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  function createServiceAt(time: string): TimeService {
    vi.setSystemTime(new Date(time));
    service = TestBed.inject(TimeService);
    return service;
  }

  function collectTicks(observable: TimeService['minuteTick$']): number[] {
    const ticks: number[] = [];
    subscriptions.push(observable.subscribe(value => ticks.push(value)));
    TestBed.tick();
    return ticks;
  }

  it('initializes startTime and currentTime to the construction time', () => {
    const constructionTime = new Date('2026-08-26T18:14:59.500Z');

    service = createServiceAt(constructionTime.toISOString());

    expect(service.startTime).toEqual(constructionTime);
    expect(service.currentDatetime()).toEqual(constructionTime);
  });

  it('updates currentTime on aligned one-second ticks', () => {
    const constructionTime = new Date('2026-08-26T18:14:59.500Z');
    service = createServiceAt(constructionTime.toISOString());

    vi.advanceTimersByTime(504);
    expect(service.currentDatetime()).toEqual(constructionTime);

    vi.advanceTimersByTime(1);
    expect(service.currentDatetime()).toEqual(new Date('2026-08-26T18:15:00.005Z'));

    vi.advanceTimersByTime(999);
    expect(service.currentDatetime()).toEqual(new Date('2026-08-26T18:15:00.005Z'));

    vi.advanceTimersByTime(1);
    expect(service.currentDatetime()).toEqual(new Date('2026-08-26T18:15:01.005Z'));
  });

  it('stops updating currentTime after destruction', () => {
    const constructionTime = new Date('2026-08-26T18:14:59.500Z');
    service = createServiceAt(constructionTime.toISOString());

    service.ngOnDestroy();
    vi.advanceTimersByTime(2000);

    expect(service.currentDatetime()).toEqual(constructionTime);
  });

  it('emits once when the minute changes', () => {
    service = createServiceAt('2026-08-26T18:14:59.500Z');
    const ticks = collectTicks(service.minuteTick$);

    expect(ticks).toEqual([Math.floor(Date.now() / 60_000)]);

    vi.advanceTimersByTime(504);
    TestBed.tick();
    expect(ticks).toHaveLength(1);

    vi.advanceTimersByTime(1);
    TestBed.tick();
    expect(ticks).toEqual([
      Math.floor(new Date('2026-08-26T18:14:59.500Z').getTime() / 60_000),
      Math.floor(new Date('2026-08-26T18:15:00.005Z').getTime() / 60_000)
    ]);

    vi.advanceTimersByTime(1000);
    TestBed.tick();
    expect(ticks).toHaveLength(2);
  });
});
