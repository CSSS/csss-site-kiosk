import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { loggingInterceptor } from '@core/logging/logging.interceptor';
import { LoggingService } from '@core/logging/logging.service';
import { Observable, of, throwError } from 'rxjs';

describe('loggingInterceptor', () => {
  const add = vi.fn();
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loggingInterceptor(req, next));

  beforeEach(() => {
    add.mockReset();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoggingService,
          useValue: { add }
        }
      ]
    });
  });

  it('logs completed GET responses and forwards every event', () => {
    const request = new HttpRequest('GET', '/events');
    const sentEvent = { type: HttpEventType.Sent } as const;
    const response = new HttpResponse<unknown>({ status: 200, body: ['event'] });
    const next = vi.fn((): Observable<HttpEvent<unknown>> => of(sentEvent, response));
    const receivedEvents: HttpEvent<unknown>[] = [];

    interceptor(request, next).subscribe((event: HttpEvent<unknown>): void => {
      receivedEvents.push(event);
    });

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(request);
    expect(receivedEvents).toEqual([sentEvent, response]);
    expect(add).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledWith(request, response);
  });

  it('does not log non-GET requests', () => {
    const request = new HttpRequest('POST', '/events', { name: 'Event' });
    const response = new HttpResponse<unknown>({ status: 201 });
    const next = vi.fn((): Observable<HttpEvent<unknown>> => of(response));

    interceptor(request, next).subscribe();

    expect(next).toHaveBeenCalledWith(request);
    expect(add).not.toHaveBeenCalled();
  });

  it('logs and propagates HTTP errors from GET requests', () => {
    const request = new HttpRequest('GET', '/events');
    const response = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      url: '/events'
    });
    const next = vi.fn((): Observable<HttpEvent<unknown>> => throwError(() => response));
    let receivedError: unknown;

    interceptor(request, next).subscribe({
      error: (error: unknown): void => {
        receivedError = error;
      }
    });

    expect(receivedError).toBe(response);
    expect(add).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledWith(request, response);
  });
});
