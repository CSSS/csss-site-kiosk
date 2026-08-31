import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidingTabDirective } from '@core/sliding-tabs/sliding-tab.directive';
import { SlidingTabsComponent } from '@core/sliding-tabs/sliding-tabs.component';

@Component({
  imports: [SlidingTabDirective, SlidingTabsComponent],
  template: `
    <ksk-sliding-tabs [(selectedTab)]="selectedTab">
      <ng-template kskSlidingTab value="first" label="First" [preserveContent]="true">
        <p class="first-content">First content</p>
      </ng-template>
      <ng-template kskSlidingTab value="second" label="Second" [preserveContent]="true">
        <p class="second-content">Second content</p>
      </ng-template>
      <ng-template kskSlidingTab value="third" label="Third" [preserveContent]="true">
        <p class="third-content">Third content</p>
      </ng-template>
    </ksk-sliding-tabs>
  `
})
class TestHostComponent {
  readonly selectedTab = signal<string | undefined>(undefined);
}

describe('SlidingTabsComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('selects the first tab by default and links tabs to their panels', () => {
    const tabs = element.querySelectorAll<HTMLElement>('[role="tab"]');
    const panels = element.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(host.selectedTab()).toBe('first');
    expect(tabs).toHaveLength(3);
    expect(panels).toHaveLength(3);
    expect(tabs[0].textContent).toContain('First');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(element.querySelector('.first-content')).not.toBeNull();
  });

  it('supports programmatic selection for any number of tabs', async () => {
    host.selectedTab.set('third');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const track = element.querySelector<HTMLElement>('.track');
    const indicator = element.querySelector<HTMLElement>('.indicator');

    expect(track?.style.transform).toBe('translateX(-200%)');
    expect(Number.parseFloat(indicator?.style.width ?? '')).toBeCloseTo(100 / 3);
    expect(indicator?.style.transform).toBe('translateX(200%)');
    expect(element.querySelector('.third-content')).not.toBeNull();
  });

  it('updates the model on click and preserves previously activated content', async () => {
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const panels = element.querySelectorAll<HTMLElement>('[role="tabpanel"]');

    expect(host.selectedTab()).toBe('second');
    expect(element.querySelector('.first-content')).not.toBeNull();
    expect(element.querySelector('.second-content')).not.toBeNull();
    expect(panels[0].hasAttribute('inert')).toBe(true);
    expect(panels[1].hasAttribute('inert')).toBe(false);
  });

  it('falls back to the first tab when selection is invalid', async () => {
    host.selectedTab.set('missing');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.selectedTab()).toBe('first');
  });
});
