import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockWeather } from './clock-weather.component';

describe('ClockWeather', () => {
  let component: ClockWeather;
  let fixture: ComponentFixture<ClockWeather>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockWeather]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockWeather);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
