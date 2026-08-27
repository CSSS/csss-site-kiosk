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

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const hex = [];
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);

  // Set the 4 bits for version 4 (0100)
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  // Set the 2 bits for clock_seq_hi_and_reserved (10)
  buffer[8] = (buffer[8] & 0x3f) | 0x80;

  for (let i = 0; i < 16; i++) {
    // Add hyphens at standard UUID positions
    if (i === 4 || i === 6 || i === 8 || i === 10) {
      hex.push('-');
    }
    hex.push(buffer[i].toString(16).padStart(2, '0'));
  }

  return hex.join('');
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
      id: generateUUID(),
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
