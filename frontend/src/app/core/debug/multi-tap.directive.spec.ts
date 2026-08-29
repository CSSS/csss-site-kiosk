import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiTapDirective } from '@core/debug/multi-tap.directive';

@Component({
  imports: [MultiTapDirective],
  template: `
    <button
      kskMultiTap
      [multiTapEnabled]="enabled"
      [tapsToTrigger]="requiredTaps"
      (multiTapTriggered)="triggered()"
    >
      Tap
    </button>
  `
})
class TestHostComponent {
  enabled = true;
  requiredTaps = 5;
  readonly triggered = vi.fn();
}

describe('MultiTapDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-25T12:00:00Z'));

    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function initialize(): void {
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  }

  function tap(type: 'click' | 'touchstart' = 'click'): void {
    button.dispatchEvent(new Event(type));
  }

  it('emits after five taps within the timeout', () => {
    initialize();

    for (let count = 0; count < 4; count++) {
      tap();
    }
    expect(host.triggered).not.toHaveBeenCalled();

    tap();

    expect(host.triggered).toHaveBeenCalledOnce();
  });

  it('uses the configured number of taps', () => {
    host.requiredTaps = 3;
    initialize();

    tap();
    tap();
    expect(host.triggered).not.toHaveBeenCalled();

    tap();

    expect(host.triggered).toHaveBeenCalledOnce();
  });

  it('counts clicks and touches together', () => {
    initialize();

    tap('click');
    tap('touchstart');
    tap('click');
    tap('touchstart');
    tap('click');

    expect(host.triggered).toHaveBeenCalledOnce();
  });

  it('discards taps outside the timeout', () => {
    initialize();

    for (let count = 0; count < 4; count++) {
      tap();
    }

    vi.advanceTimersByTime(3001);
    tap();

    expect(host.triggered).not.toHaveBeenCalled();

    for (let count = 0; count < 4; count++) {
      tap();
    }

    expect(host.triggered).toHaveBeenCalledOnce();
  });

  it('starts a new tap sequence after triggering', () => {
    initialize();

    for (let count = 0; count < 10; count++) {
      tap();
    }

    expect(host.triggered).toHaveBeenCalledTimes(2);
  });

  it('does not listen for taps when disabled', () => {
    host.enabled = false;
    initialize();

    for (let count = 0; count < 5; count++) {
      tap();
    }

    expect(host.triggered).not.toHaveBeenCalled();
  });

  it('stops listening when the host is destroyed', () => {
    initialize();
    const detachedButton = button;

    fixture.destroy();

    for (let count = 0; count < 5; count++) {
      detachedButton.dispatchEvent(new Event('click'));
    }

    expect(host.triggered).not.toHaveBeenCalled();
  });
});
