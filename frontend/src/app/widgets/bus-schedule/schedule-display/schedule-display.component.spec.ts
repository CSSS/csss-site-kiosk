import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleDisplayComponent } from '@widgets/bus-schedule/schedule-display/schedule-display.component';

describe('ScheduleDisplayComponent', () => {
  let component: ScheduleDisplayComponent;
  let fixture: ComponentFixture<ScheduleDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDisplayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleDisplayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
