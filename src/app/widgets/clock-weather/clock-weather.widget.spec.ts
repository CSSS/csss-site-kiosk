import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockWeatherComponent } from './clock-weather.widget';

describe('ClockWeatherComponent', () => {
  let component: ClockWeatherComponent;
  let fixture: ComponentFixture<ClockWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockWeatherComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockWeatherComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
