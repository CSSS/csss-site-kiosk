import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { ModalService } from '@core/modal/modal.service';
import { LucideArrowLeft, LucideX } from '@lucide/angular';
import { NgpDialog, NgpDialogOverlay, provideDialogState } from 'ng-primitives/dialog';

@Component({
  hostDirectives: [NgpDialogOverlay],
  imports: [NgpDialog, NgTemplateOutlet, NgComponentOutlet, LucideArrowLeft, LucideX],
  providers: [provideDialogState()],
  selector: 'ksk-modal',
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
  host: {
    '[style.--width]': 'modal.current()?.layout?.width',
    '[style.--height]': 'modal.current()?.layout?.height',
    '[style.--padding]': 'modal.current()?.layout?.padding'
  }
})
export class ModalComponent {
  modal = inject(ModalService);

  protected readonly content = input.required<TemplateRef<unknown>>();
}
