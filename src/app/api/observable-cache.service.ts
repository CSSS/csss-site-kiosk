import { Observable, shareReplay } from 'rxjs';

// 1 hour in milliseconds
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Caches observable values for a certain amount of time.
 * Default TTL is 1 hour.
 */
export class ObservableCache {
  private cache = new Map<string, Observable<unknown>>();

  constructor(private ttl: number = CACHE_TTL) {}

  get<T>(key: string, fetcher: () => Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        fetcher().pipe(
          shareReplay({
            bufferSize: 1,
            refCount: true,
            windowTime: this.ttl
          })
        )
      );
    }

    return this.cache.get(key) as Observable<T>;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
