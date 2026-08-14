import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockWeatherWidget } from './clock-weather.widget';

describe('ClockWeatherWidget', () => {
  let component: ClockWeatherWidget;
  let fixture: ComponentFixture<ClockWeatherWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockWeatherWidget]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockWeatherWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
