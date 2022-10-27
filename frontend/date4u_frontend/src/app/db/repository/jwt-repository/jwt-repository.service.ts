import { Injectable } from '@angular/core';
import { JwtAuthenticated } from '../../model/JwtAuthenticated';

@Injectable({
  providedIn: 'root'
})
export class JwtRepositoryService {

  constructor() { }

  createJwt(jwtAuthenticated: JwtAuthenticated): void {
    localStorage.setItem('jwt-authenticated', JSON.stringify(jwtAuthenticated));
  }

  getJwt(): JwtAuthenticated | null {
    let jwtAuthenticated: JwtAuthenticated | null = null;

    const jwtAuthenticatedStr = localStorage.getItem('jwt-authenticated');
    if (jwtAuthenticatedStr !== null) {
      jwtAuthenticated = JSON.parse(jwtAuthenticatedStr);
    }

    return jwtAuthenticated;
  }

  removeJwt(): void {
    localStorage.removeItem('jwt-authenticated');
  }

}
