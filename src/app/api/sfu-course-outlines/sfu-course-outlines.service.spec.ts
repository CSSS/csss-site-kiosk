import { TestBed } from '@angular/core/testing';

import { SfuCourseOutlines } from './sfu-course-outlines.service';

describe('SfuCourseOutlines', () => {
  let service: SfuCourseOutlines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SfuCourseOutlines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
