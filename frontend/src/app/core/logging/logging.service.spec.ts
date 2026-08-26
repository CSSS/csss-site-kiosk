import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LoggingService, MAX_CACHE_SIZE } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('records a timestamped HTTP response', () => {
    const timestamp = new Date('2026-08-24T12:00:00Z');
    const request = new HttpRequest('GET', '/events?page=2');
    const response = new HttpResponse({ status: 200, body: ['event'] });
    vi.useFakeTimers();
    vi.setSystemTime(timestamp);

    service.add(request, response);

    expect(service.entries()).toEqual([
      {
        id: expect.any(String),
        timestamp,
        url: '/events?page=2',
        status: 200
      }
    ]);
  });

  it('records HTTP error responses', () => {
    const request = new HttpRequest('GET', '/events');
    const response = new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
      url: '/events'
    });

    service.add(request, response);

    expect(service.entries()).toEqual([
      {
        id: expect.any(String),
        timestamp: expect.any(Date),
        url: '/events',
        status: 503
      }
    ]);
  });

  it('keeps only the most recent entries when the cache is full', () => {
    for (let index = 0; index <= MAX_CACHE_SIZE; index++) {
      service.add(
        new HttpRequest('GET', `/requests/${index}`),
        new HttpResponse({ status: 200, body: index })
      );
    }

    expect(service.entries()).toHaveLength(MAX_CACHE_SIZE);
    expect(service.entries()[0].url).toBe('/requests/1');
    expect(service.entries().at(-1)?.url).toBe(`/requests/${MAX_CACHE_SIZE}`);
  });
});
