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

  /**
   * Retrieves the requested value either from the source or cache.
   *
   * @template T - return type from fetcher
   * @param key - key to cache the value under
   * @param fetcher - function that returns an Observable that fetches data
   * @param ttl - time to expire cached value
   * @returns Observable<T> - observable of the cached value or the fetched value if not cached
   */
  get<T>(key: string, fetcher: () => Observable<T>, ttl?: number): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        fetcher().pipe(
          shareReplay({
            bufferSize: 1,
            refCount: true,
            windowTime: ttl ?? this.ttl
          })
        )
      );
    }

    return this.cache.get(key) as Observable<T>;
  }

  /**
   * Deletes a cached value if key is provided. If no key is provided then it deletes the whole cache.
   *
   * @param key - key to the value to delete
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
