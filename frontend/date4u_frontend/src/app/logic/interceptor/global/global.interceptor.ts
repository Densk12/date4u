import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  private publicURLs = [
    `${environment.apiURL}/authenticated`,
    `${environment.apiURL}/register`,
  ];

  constructor(
    private jwtRepo: JwtRepositoryService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const publicURL = this.publicURLs.filter(pu => pu === request.url)[0];

    if (publicURL === null) {
      request = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.jwtRepo.getJwt()?.jwtToken}`
        })
      });
    }

    return next.handle(request);
  }
}
