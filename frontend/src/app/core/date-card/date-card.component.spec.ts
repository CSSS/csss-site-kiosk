import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCardComponent } from '@core/date-card/date-card.component';

describe('DateCardComponent', () => {
  let component: DateCardComponent;
  let fixture: ComponentFixture<DateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DateCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses the fallback image when no image source is provided', () => {
    setRequiredInputs();
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe('/images/placeholder.webp');
  });

  it('uses the fallback image when the provided image fails to load', () => {
    setRequiredInputs();
    fixture.componentRef.setInput('imgSrc', 'missing.webp');
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    const fallbackImage = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(fallbackImage.getAttribute('src')).toBe('/images/placeholder.webp');
  });

  function setRequiredInputs(): void {
    fixture.componentRef.setInput('date', new Date('2026-09-02T12:00:00-07:00'));
    fixture.componentRef.setInput('title', 'Test event');
    fixture.componentRef.setInput('width', 340);
    fixture.componentRef.setInput('height', 400);
  }
});
