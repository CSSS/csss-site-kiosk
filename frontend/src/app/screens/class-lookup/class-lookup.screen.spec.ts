import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLookupComponent } from './class-lookup.screen';

describe('ClassLookupComponent', () => {
  let component: ClassLookupComponent;
  let fixture: ComponentFixture<ClassLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLookupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassLookupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
