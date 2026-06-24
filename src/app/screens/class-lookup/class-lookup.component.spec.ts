import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLookup } from './class-lookup.component';

describe('ClassLookup', () => {
  let component: ClassLookup;
  let fixture: ComponentFixture<ClassLookup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLookup]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassLookup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
