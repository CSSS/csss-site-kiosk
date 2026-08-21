import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ksk-date-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './date-card.component.html',
  styleUrl: './date-card.component.scss',
  host: {
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()'
  }
})
export class DateCardComponent {
  date = input.required<Date>();
  title = input.required<string>();
  description = input();
  imgSrc = input.required<string>();
  width = input.required<number>();
  height = input.required<number>();
}
