import { Observable, shareReplay } from 'rxjs';

// 1 hour in milliseconds
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Caches HTTP observable values for a certain amount of time.
 * Default TTL is 1 hour.
 */
interface CacheEntry<T> {
  value: Observable<T>;
  expiresAt: number;
}

export class ObservableCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  constructor(private ttl: number = CACHE_TTL) {}

  /**
   * Retrieves the requested value either from the source or cache.
   *
   * @template T - return type from fetcher
   * @param key - key to cache the value under
   * @param fetcher - function that returns an Observable that fetches data
   * @param ttl - time to expire cached value, in milliseconds
   * @returns Observable<T> - observable of the cached value or the fetched value if not cached
   */
  get<T>(key: string, fetcher: () => Observable<T>, ttl?: number): Observable<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt >= now) {
      return cached.value as Observable<T>;
    }

    const entryTtl = ttl ?? this.ttl;
    const value = fetcher().pipe(shareReplay(1));

    this.cache.set(key, {
      value,
      expiresAt: now + entryTtl
    });

    return value;
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
