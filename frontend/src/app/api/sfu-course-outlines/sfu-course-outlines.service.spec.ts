import { TestBed } from '@angular/core/testing';

import { SfuCourseOutlinesService } from './sfu-course-outlines.service';

describe('SfuCourseOutlinesService', () => {
  let service: SfuCourseOutlinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SfuCourseOutlinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
