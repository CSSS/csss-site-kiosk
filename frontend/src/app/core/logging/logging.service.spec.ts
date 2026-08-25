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
    const request = new HttpRequest('GET', '/events');
    const response = new HttpResponse({ status: 200, body: ['event'] });
    vi.useFakeTimers();
    vi.setSystemTime(timestamp);

    service.add(request, response);

    expect(service['_httpLog']).toEqual([
      {
        timestamp,
        request,
        response
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

    expect(service['_httpLog']).toHaveLength(1);
    expect(service['_httpLog'][0]).toMatchObject({ request, response });
  });

  it('keeps only the most recent entries when the cache is full', () => {
    for (let index = 0; index <= MAX_CACHE_SIZE; index++) {
      service.add(
        new HttpRequest('GET', `/requests/${index}`),
        new HttpResponse({ status: 200, body: index })
      );
    }

    expect(service['_httpLog']).toHaveLength(MAX_CACHE_SIZE);
    expect(service['_httpLog'][0].request.url).toBe('/requests/1');
    expect(service['_httpLog'].at(-1)?.request.url).toBe(`/requests/${MAX_CACHE_SIZE}`);
  });
});
