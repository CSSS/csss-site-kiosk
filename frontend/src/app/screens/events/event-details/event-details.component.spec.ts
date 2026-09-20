import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event as CsssEvent } from '@csss-api';
import { KioskEvent } from '../event.types';
import { EventDetailsComponent } from './event-details.component';

const MOCK_EVENT: CsssEvent = {
  name: 'Test Event',
  description: 'Description',
  start_datetime: '2026-01-01T00:00:00Z',
  end_datetime: '2026-01-01T01:00:00Z',
  status: 'scheduled',
  eid: 0,
  image_url: ''
};

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', new KioskEvent(MOCK_EVENT));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
