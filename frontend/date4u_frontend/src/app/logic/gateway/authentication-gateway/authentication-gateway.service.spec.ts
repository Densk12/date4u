import { TestBed } from '@angular/core/testing';

import { AuthenticationGatewayService } from './authentication-gateway.service';

describe('AuthenticationGatewayService', () => {
  let service: AuthenticationGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
