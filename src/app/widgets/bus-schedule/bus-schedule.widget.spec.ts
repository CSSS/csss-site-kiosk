import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusScheduleWidget } from './bus-schedule.widget';

describe('BusScheduleWidget', () => {
  let component: BusScheduleWidget;
  let fixture: ComponentFixture<BusScheduleWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusScheduleWidget]
    }).compileComponents();

    fixture = TestBed.createComponent(BusScheduleWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
