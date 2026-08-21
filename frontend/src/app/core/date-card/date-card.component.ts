import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'ksk-date-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './date-card.component.html',
  styleUrl: './date-card.component.scss'
})
export class DateCardComponent {
  date = input.required<Date>();
  title = input.required<string>();
  description = input.required<string>();
  imgSrc = input.required<string>();
}
