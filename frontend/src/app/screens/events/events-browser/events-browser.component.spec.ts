import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBrowserComponent } from './events-browser.component';

describe('EventsBrowserComponent', () => {
  let component: EventsBrowserComponent;
  let fixture: ComponentFixture<EventsBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsBrowserComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsBrowserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
