import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busTime'
})
export class BusTimePipe implements PipeTransform {
  transform(secondsToDeparture: number): string {
    const time = Math.ceil(secondsToDeparture / 60);

    return time < 1 ? '< 1' : time.toString();
  }
}
