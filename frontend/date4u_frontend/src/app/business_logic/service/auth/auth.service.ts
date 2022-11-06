import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { ProfileRepositoryService } from 'src/app/db/repository/profile-repository/profile-repository.service';
import { UserRegistrationBorder } from '../../borderclasses/UserRegistrationBorder';
import { AuthGatewayService } from '../auth-gateway/auth-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private authGateway: AuthGatewayService,
    private profileRepo: ProfileRepositoryService,
    private jwtRepo: JwtRepositoryService
  ) { }

  logout(): void {
    this.jwtRepo.removeJwt();
    this.router.navigate(['/login']);
  }

  register(user: UserRegistrationBorder, photo: File): Observable<boolean> {
    return new Observable<boolean>((subscriber: Subscriber<boolean>): void => {
      this.authGateway.register(user)
        .subscribe((success: boolean): void => {
          if (success) {
            this.profileRepo.createPhotoByProfileId(this.jwtRepo.getJwt()?.profileId as any, photo, true)
              .subscribe((success: boolean) => {
                if (success) {
                  subscriber.next(true);
                } else {
                  subscriber.next(false);
                }
              });
          } else {
            subscriber.next(false);
          }
        });
    });
  }

}
