import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { LucideArrowLeft, LucideX } from '@lucide/angular';
import { NgpDialog, NgpDialogOverlay, provideDialogState } from 'ng-primitives/dialog';
import { ModalService } from './modal.service';

@Component({
  hostDirectives: [NgpDialogOverlay],
  imports: [NgpDialog, NgTemplateOutlet, NgComponentOutlet, LucideArrowLeft, LucideX],
  providers: [provideDialogState()],
  selector: 'ksk-modal',
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  modal = inject(ModalService);

  protected readonly content = input.required<TemplateRef<unknown>>();
}
