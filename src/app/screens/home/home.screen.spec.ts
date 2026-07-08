import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter, RouterLink } from '@angular/router';
import { MockBusScheduleWidget } from '../../widgets/bus-schedule/bus-schedule.widget.mock';
import { MockEventWidget } from '../../widgets/event/event.widget.mock';
import { HomeScreen } from './home.screen';

describe('HomeScreen', () => {
  let component: HomeScreen;
  let fixture: ComponentFixture<HomeScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeScreen],
      providers: [provideRouter([])]
    })
      .overrideComponent(HomeScreen, {
        set: {
          imports: [MockEventWidget, MockBusScheduleWidget, RouterLink]
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
