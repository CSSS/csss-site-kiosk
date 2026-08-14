import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsScreen } from './events.screen';

describe('EventsScreen', () => {
  let component: EventsScreen;
  let fixture: ComponentFixture<EventsScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsScreen]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
