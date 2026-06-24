import { TestBed } from '@angular/core/testing';

import { ObservableCache } from './observable-cache';

describe('ObservableCache', () => {
  let service: ObservableCache;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservableCache);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
