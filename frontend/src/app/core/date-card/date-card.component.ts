import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';

const FALLBACK_IMAGE_SRC = '/images/placeholder.webp';

@Component({
  selector: 'ksk-date-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './date-card.component.html',
  styleUrl: './date-card.component.scss',
  host: {
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()',
    '(click)': 'tapped.emit()'
  }
})
export class DateCardComponent {
  date = input.required<Date>();
  title = input.required<string>();
  description = input();
  imgSrc = input.required<string>();
  width = input.required<number>();
  height = input.required<number>();

  tapped = output();

  protected readonly fallbackImageSrc = FALLBACK_IMAGE_SRC;
  private readonly failedImageSrc = signal<string | null | undefined>(undefined);

  protected readonly useFallbackImage = computed(() => {
    const imgSrc = this.imgSrc();

    return !imgSrc || imgSrc === this.failedImageSrc();
  });

  protected handleImageError(): void {
    this.failedImageSrc.set(this.imgSrc());
  }
}
