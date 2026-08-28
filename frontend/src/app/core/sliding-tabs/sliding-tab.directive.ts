import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: 'ng-template[kskSlidingTab]'
})
export class SlidingTabDirective {
  readonly template = inject(TemplateRef<unknown>);

  readonly value = input.required<string>();

  readonly label = input.required<string>();

  readonly preserveContent = input.required<boolean>();
}
