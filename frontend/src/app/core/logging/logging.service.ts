import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Service } from '@angular/core';

export const MAX_CACHE_SIZE = 100; // Maximum number of log entries to keep in memory

export interface HttpLogEntry {
  timestamp: Date;
  request: HttpRequest<unknown>;
  response: HttpResponse<unknown> | HttpErrorResponse;
}

@Service()
export class LoggingService {
  private _httpLog: HttpLogEntry[] = [];

  add(req: HttpRequest<unknown>, res: HttpResponse<unknown> | HttpErrorResponse): void {
    const logEntry = {
      timestamp: new Date(),
      request: req,
      response: res
    };

    if (this._httpLog.length >= MAX_CACHE_SIZE) {
      this._httpLog.shift();
    }

    this._httpLog.push(logEntry);
  }
}
