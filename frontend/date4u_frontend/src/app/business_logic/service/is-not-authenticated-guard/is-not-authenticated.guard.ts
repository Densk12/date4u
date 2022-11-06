import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';

@Injectable({
  providedIn: 'root'
})
export class IsNotAuthenticatedGuard implements CanActivate {

  constructor(
    private jwtRepo: JwtRepositoryService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let canActivate = true;
    const jwt = this.jwtRepo.getJwt();

    if (jwt !== null) {
      canActivate = false;
      this.router.navigate(['/profile', jwt.profileId]);
    }

    return canActivate;
  }

}
