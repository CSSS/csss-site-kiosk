import { DestroyRef, Directive, ElementRef, inject, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, scan } from 'rxjs';

interface TapState {
  timestamps: number[];
  triggered: boolean;
}

const TAPS_TO_TRIGGER = 5;
const TAP_TIMEOUT = 3000;

@Directive({
  selector: '[kskMultiTap]'
})
export class MultiTapDirective implements OnInit {
  multiTapEnabled = input.required<boolean>();

  tapsToTrigger = input<number>(TAPS_TO_TRIGGER);

  multiTapTriggered = output();

  private el = inject(ElementRef);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.multiTapEnabled()) {
      return;
    }

    const element = this.el.nativeElement;

    const clicks$ = fromEvent(element, 'click');
    const touches$ = fromEvent(element, 'touchstart');

    merge(clicks$, touches$)
      .pipe(
        map(() => Date.now()),
        // Accumulate timestamps from every single touch, filtering out the ones that are outside the time limit
        scan(
          (state: TapState, now: number) => {
            const timestamps = [...state.timestamps.filter(time => now - time <= TAP_TIMEOUT), now];

            if (timestamps.length >= this.tapsToTrigger()) {
              return {
                timestamps: [],
                triggered: true
              };
            }

            return {
              timestamps: timestamps,
              triggered: false
            };
          },
          {
            timestamps: [] as number[],
            triggered: false
          }
        ),
        filter(state => state.triggered),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.multiTapTriggered.emit();
      });
  }
}
