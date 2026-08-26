import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoggingService } from './logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const logService = inject(LoggingService);

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          logService.add(req, event);
        }
      },
      error: (error: unknown): void => {
        if (error instanceof HttpErrorResponse) {
          logService.add(req, error);
        }
      }
    })
  );
};
