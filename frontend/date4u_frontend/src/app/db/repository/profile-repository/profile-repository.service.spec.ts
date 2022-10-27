import { TestBed } from '@angular/core/testing';

import { ProfileRepositoryService } from './profile-repository.service';

describe('ProfileRepositoryService', () => {
  let service: ProfileRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
