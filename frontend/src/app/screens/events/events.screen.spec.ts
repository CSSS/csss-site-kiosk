import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KioskCalendarEvent } from '@screens/events/event.types';
import { EventsBrowserComponent } from '@screens/events/events-browser/events-browser.component';
import { EventsCalendarComponent } from '@screens/events/events-calendar/events-calendar.component';
import { EventsScreen } from '@screens/events/events.screen';

@Component({
  selector: 'ksk-events-browser',
  template: '<p class="browser-content">Browser</p>'
})
class MockEventsBrowserComponent {
  readonly events = input.required<KioskCalendarEvent[]>();
}

@Component({
  selector: 'ksk-events-calendar',
  template: '<p class="calendar-content">Calendar</p>'
})
class MockEventsCalendarComponent {
  readonly events = input.required<KioskCalendarEvent[]>();
}

describe('EventsScreen', () => {
  let component: EventsScreen;
  let fixture: ComponentFixture<EventsScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsScreen]
    })
      .overrideComponent(EventsScreen, {
        remove: { imports: [EventsBrowserComponent, EventsCalendarComponent] },
        add: { imports: [MockEventsBrowserComponent, MockEventsCalendarComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(EventsScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders and switches between the event views', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect([...tabs].map(tab => tab.textContent?.trim())).toEqual(['Browse', 'Calendar']);
    expect(element.querySelector('.browser-content')).not.toBeNull();
    expect(element.querySelector('.calendar-content')).toBeNull();

    tabs[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('.browser-content')).not.toBeNull();
    expect(element.querySelector('.calendar-content')).not.toBeNull();
  });
});
