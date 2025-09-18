import { TestBed } from '@angular/core/testing';

import { IntructorService } from './intructor.service';

describe('IntructorService', () => {
  let service: IntructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
