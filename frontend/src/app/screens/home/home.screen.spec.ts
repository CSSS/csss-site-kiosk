import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeScreen } from '@screens/home/home.screen';
import { BusScheduleWidget } from '@widgets/bus-schedule/bus-schedule.widget';
import { MockBusScheduleWidget } from '@widgets/bus-schedule/bus-schedule.widget.mock';
import { EventWidget } from '@widgets/event/event.widget';
import { MockEventWidget } from '@widgets/event/event.widget.mock';

describe('HomeScreen', () => {
  let component: HomeScreen;
  let fixture: ComponentFixture<HomeScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeScreen],
      providers: [provideRouter([])]
    })
      .overrideComponent(HomeScreen, {
        remove: {
          imports: [EventWidget, BusScheduleWidget]
        },
        add: {
          imports: [MockEventWidget, MockBusScheduleWidget]
        }
      })
      .compileComponents();
    fixture = TestBed.createComponent(HomeScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
