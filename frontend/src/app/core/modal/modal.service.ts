import { computed, inject, Service, signal, TemplateRef, Type } from '@angular/core';
import { ModalComponent } from '@core/modal/modal.component';
import { NgpDialogManager, NgpDialogRef } from 'ng-primitives/dialog';

export type ModalContent<T = unknown> =
  | {
      type: 'template';
      title: string;
      content: TemplateRef<unknown>;
      context?: T;
    }
  | {
      type: 'component';
      title: string;
      content: Type<unknown>;
      inputs?: Record<string, unknown>;
    };

@Service()
export class ModalService {
  private readonly dialogManager = inject(NgpDialogManager);

  private dialogRef?: NgpDialogRef;

  private readonly stack = signal<ModalContent[]>([]);

  readonly current = computed(() => this.stack().at(-1));

  readonly previous = computed(() => this.stack().at(-2));

  /**
   * Opens a modal page if one does not already exist
   * or pushes a new page onto the stack.
   *
   * @param page - modal content to open
   */
  open(page: ModalContent): NgpDialogRef {
    if (!this.dialogRef) {
      return this._openModal(page);
    }

    this._push(page);
    return this.dialogRef;
  }

  /**
   * Pops the item from the stack.
   */
  back(): void {
    this.stack.update(stack => (stack.length > 1 ? stack.slice(0, -1) : stack));
  }

  close(): void {
    this.dialogRef?.close();
  }

  private _openModal(page: ModalContent): NgpDialogRef {
    this.stack.set([page]);

    const dialogRef = this.dialogManager.open(ModalComponent);
    this.dialogRef = dialogRef;

    dialogRef.afterClosed.subscribe(() => {
      this.stack.set([]);
      this.dialogRef = undefined;
    });

    return dialogRef;
  }

  private _push(page: ModalContent): void {
    if (this.current()?.title === page.title) {
      return;
    }

    this.stack.update(stack => [...stack, page]);
  }
}
