import { TestBed } from '@angular/core/testing';

import { DialogViewService } from './dialog-view.service';

describe('DialogViewService', () => {
  let service: DialogViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
