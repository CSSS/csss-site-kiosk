import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWidget } from './event.widget';

describe('EventWidget', () => {
  let component: EventWidget;
  let fixture: ComponentFixture<EventWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventWidget]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
