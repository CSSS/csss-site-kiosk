import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { computed, Service, signal } from '@angular/core';

export const MAX_CACHE_SIZE = 100; // Maximum number of log entries to keep in memory

export interface HttpLogEntry {
  id: string;
  timestamp: Date;
  request: HttpRequest<unknown>;
  response: HttpResponse<unknown> | HttpErrorResponse;
}

interface HttpLogResult {
  id: string;
  timestamp: Date;
  url: string;
  status: number;
}

@Service()
export class LoggingService {
  private _httpLog = signal<HttpLogEntry[]>([]);

  entries = computed<HttpLogResult[]>(() =>
    this._httpLog().map(e => {
      return {
        id: e.id,
        timestamp: e.timestamp,
        url: e.request.urlWithParams,
        status: e.response.status
      };
    })
  );

  add(req: HttpRequest<unknown>, res: HttpResponse<unknown> | HttpErrorResponse): void {
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      request: req,
      response: res
    };

    if (this._httpLog().length >= MAX_CACHE_SIZE) {
      this._httpLog.update(logs => logs.slice(1));
    }

    this._httpLog.update(logs => [...logs, logEntry]);
  }
}
