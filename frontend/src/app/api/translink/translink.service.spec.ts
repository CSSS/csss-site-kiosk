import { TestBed } from '@angular/core/testing';

import { TranslinkService } from './translink.service';

describe('TranslinkService', () => {
  let service: TranslinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
