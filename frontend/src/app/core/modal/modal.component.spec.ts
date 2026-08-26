import { Component, signal, TemplateRef, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgpDialogRef } from 'ng-primitives/dialog';
import { provideExitAnimationManager } from 'ng-primitives/internal';
import { ModalComponent } from './modal.component';
import { ModalContent, ModalService } from './modal.service';

@Component({
  template: '<p class="component-content">{{ content }}</p>'
})
class TestContentComponent {
  readonly content = 'Component content';
}

@Component({
  template: `
    <ng-template #content>
      <p class="template-content">Template content</p>
    </ng-template>
  `
})
class TemplateHostComponent {
  readonly content = viewChild.required<TemplateRef<unknown>>('content');
}

describe('ModalComponent', () => {
  const back = vi.fn();
  const close = vi.fn();
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let current: WritableSignal<ModalContent | undefined>;
  let previous: WritableSignal<ModalContent | undefined>;

  beforeEach(async () => {
    back.mockReset();
    close.mockReset();
    current = signal<ModalContent | undefined>(undefined);
    previous = signal<ModalContent | undefined>(undefined);

    await TestBed.configureTestingModule({
      imports: [ModalComponent, TemplateHostComponent],
      providers: [
        provideExitAnimationManager(),
        {
          provide: ModalService,
          useValue: { current, previous, back, close }
        },
        {
          provide: NgpDialogRef,
          useValue: {
            config: { closeOnClick: true },
            close: vi.fn(),
            closeOnOutsideClick: true,
            disableClose: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the current component page and title', () => {
    current.set({
      type: 'component',
      title: 'Component page',
      content: TestContentComponent
    });

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain('Component page');
    expect(fixture.nativeElement.querySelector('.component-content')?.textContent).toContain(
      'Component content'
    );
  });

  it('renders the current template page', () => {
    const hostFixture = TestBed.createComponent(TemplateHostComponent);
    hostFixture.detectChanges();
    current.set({
      type: 'template',
      title: 'Template page',
      content: hostFixture.componentInstance.content()
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.template-content')?.textContent).toContain(
      'Template content'
    );
  });

  it('shows the previous page and navigates back', () => {
    previous.set({
      type: 'component',
      title: 'Previous page',
      content: TestContentComponent
    });

    fixture.detectChanges();
    const backButton: HTMLButtonElement = fixture.nativeElement.querySelector('.back__button');

    expect(backButton.textContent).toContain('Previous page');

    backButton.click();

    expect(back).toHaveBeenCalledOnce();
  });

  it('does not show a back button without a previous page', () => {
    expect(fixture.nativeElement.querySelector('.back__button')).toBeNull();
  });

  it('closes the modal from the close button', () => {
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.close button');

    closeButton.click();

    expect(close).toHaveBeenCalledOnce();
  });
});
