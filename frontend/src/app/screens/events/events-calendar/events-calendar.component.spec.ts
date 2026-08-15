import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCalendarComponent } from './events-calendar.component';

describe('EventsCalendarComponent', () => {
  let component: EventsCalendarComponent;
  let fixture: ComponentFixture<EventsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsCalendarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsCalendarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
