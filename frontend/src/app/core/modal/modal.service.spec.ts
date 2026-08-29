import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ModalComponent } from '@core/modal/modal.component';
import { ModalContent, ModalService } from '@core/modal/modal.service';
import { NgpDialogManager } from 'ng-primitives/dialog';
import { Subject } from 'rxjs';

@Component({ template: '' })
class TestPageComponent {
  readonly testPage = true;
}

describe('ModalService', () => {
  const close = vi.fn();
  const open = vi.fn();
  let service: ModalService;
  let afterClosed: Subject<void>;

  const firstPage: ModalContent = {
    type: 'component',
    title: 'First page',
    content: TestPageComponent
  };

  const secondPage: ModalContent = {
    type: 'component',
    title: 'Second page',
    content: TestPageComponent
  };

  beforeEach(() => {
    close.mockReset();
    open.mockReset();
    afterClosed = new Subject<void>();
    open.mockReturnValue({ afterClosed, close });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NgpDialogManager,
          useValue: { open }
        }
      ]
    });
    service = TestBed.inject(ModalService);
  });

  it('opens the modal with the first page', () => {
    service.open(firstPage);

    expect(open).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledWith(ModalComponent);
    expect(service.current()).toBe(firstPage);
    expect(service.previous()).toBeUndefined();
  });

  it('pushes subsequent pages without opening another dialog', () => {
    service.open(firstPage);
    service.open(secondPage);

    expect(open).toHaveBeenCalledOnce();
    expect(service.current()).toBe(secondPage);
    expect(service.previous()).toBe(firstPage);
  });

  it('navigates back without removing the root page', () => {
    service.open(firstPage);
    service.open(secondPage);

    service.back();

    expect(service.current()).toBe(firstPage);
    expect(service.previous()).toBeUndefined();

    service.back();

    expect(service.current()).toBe(firstPage);
  });

  it('closes the active dialog', () => {
    service.close();
    expect(close).not.toHaveBeenCalled();

    service.open(firstPage);
    service.close();

    expect(close).toHaveBeenCalledOnce();
  });

  it('clears the stack and allows another modal after the dialog closes', () => {
    service.open(firstPage);

    afterClosed.next();

    expect(service.current()).toBeUndefined();
    expect(service.previous()).toBeUndefined();

    service.open(secondPage);

    expect(open).toHaveBeenCalledTimes(2);
    expect(service.current()).toBe(secondPage);
  });
});
