import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ObservableCache } from './observable-cache';

describe('ObservableCache', () => {
  let service: ObservableCache;

  beforeEach(() => {
    service = new ObservableCache();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should reuse cached observables before the ttl expires', () => {
    const fetcher = vi.fn().mockReturnValue(of('cached'));

    const first = service.get('key', fetcher, 1000);
    const second = service.get('key', fetcher, 1000);

    expect(second).toBe(first);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should replay cached values to later subscribers before the ttl expires', async () => {
    const fetcher = vi.fn().mockReturnValue(of('cached'));

    await expect(firstValueFrom(service.get('key', fetcher, 1000))).resolves.toBe('cached');
    await expect(firstValueFrom(service.get('key', fetcher, 1000))).resolves.toBe('cached');

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should reuse cached observables at the exact expiration time', () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockReturnValue(of('cached'));

    const first = service.get('key', fetcher, 1000);
    vi.advanceTimersByTime(1000);
    const second = service.get('key', fetcher, 1000);

    expect(second).toBe(first);
    expect(fetcher).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should create a new observable after the ttl expires', () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockReturnValue(of('cached'));

    const first = service.get('key', fetcher, 1000);
    vi.advanceTimersByTime(1001);
    const second = service.get('key', fetcher, 1000);

    expect(second).not.toBe(first);
    expect(fetcher).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
