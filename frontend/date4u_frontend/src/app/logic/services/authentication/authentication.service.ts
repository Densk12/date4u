import { Injectable } from '@angular/core';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private jwtRepo: JwtRepositoryService
  ) { }

  logout(): void {
    this.jwtRepo.removeJwt();
  }
  
}
