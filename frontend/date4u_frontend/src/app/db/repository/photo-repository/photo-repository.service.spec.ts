import { TestBed } from '@angular/core/testing';

import { PhotoRepositoryService } from './photo-repository.service';

describe('PhotoRepositoryService', () => {
  let service: PhotoRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
