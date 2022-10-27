import { TestBed } from '@angular/core/testing';

import { JwtRepositoryService } from './jwt-repository.service';

describe('JwtRepositoryService', () => {
  let service: JwtRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
