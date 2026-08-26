import { Pipe, PipeTransform } from '@angular/core';

const SEC_IN_MS = 1000;
const MIN_IN_MS = SEC_IN_MS * 60;
const HOUR_IN_MS = MIN_IN_MS * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    const days = Math.floor(value / DAY_IN_MS);
    const hours = Math.floor((value % DAY_IN_MS) / HOUR_IN_MS);
    const minutes = Math.floor((value % HOUR_IN_MS) / MIN_IN_MS);
    const seconds = Math.floor((value % MIN_IN_MS) / SEC_IN_MS);

    const result = [];

    if (days > 0) {
      result.push(`${days}d`);
    }

    if (hours > 0 || days > 0) {
      result.push(`${hours}h`);
    }

    if (minutes > 0 || hours > 0 || days > 0) {
      result.push(`${minutes}m`);
    }

    result.push(`${seconds}s`);

    return result.join(' ');
  }
}
