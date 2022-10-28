import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserLoginBorder } from '../../borderclasses/UserLoginBorder';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtAuthenticated } from '../../../db/model/JwtAuthenticated';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { UserRegistrationBorder } from '../../borderclasses/UserRegistrationBorder';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGatewayService {

  constructor(
    private http: HttpClient,
    private jwtRepo: JwtRepositoryService
  ) { }

  login(user: UserLoginBorder): Observable<boolean> {
    // return new Observable<boolean>((subscriber: Subscriber<boolean>): void => {
    //   fetch(`${environment.apiURL}/authenticate`, {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(user)
    //   }).then((rawRsponse: any) => {
    //     rawRsponse.json().then((jsonResponse: any) => {
    //       console.log(jsonResponse);

    //       const jwtAuthenticated: JwtAuthenticated = {
    //         profileId: jsonResponse['profile-id'],
    //         jwtToken: jsonResponse['jwt-token']
    //       };

    //       this.jwtRepo.createJwt(jwtAuthenticated);

    //       subscriber.next(true);
    //     });
    //   }).catch((): void => subscriber.next(false));
    // });

    return this.http.post(
      `${environment.apiURL}/authenticate`,
      user,
      { headers: new HttpHeaders({ accept: 'application/json', 'Content-Type': 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): boolean => {
        console.log(jsonResponse);

        const jwtAuthenticated: JwtAuthenticated = {
          profileId: jsonResponse['profile-id'],
          jwtToken: jsonResponse['jwt-token']
        };

        this.jwtRepo.createJwt(jwtAuthenticated);

        return true;
      }),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  register(user: UserRegistrationBorder): Observable<boolean> {
    return this.http.post(
      `${environment.apiURL}/register`,
      {
        email: user.email,
        password: user.password,
        birthday: user.birthday,
        nickname: user.nickname,
        hornlength: user.hornlength,
        gender: user.gender,
        'attracted-to-gender': user.attractedToGender,
        description: user.description,
        image: user.image
      },
      { headers: new HttpHeaders({ accept: 'application/json', 'content-type': 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): boolean => {
        const jwtAuthenticated: JwtAuthenticated = {
          profileId: jsonResponse['profile-id'],
          jwtToken: jsonResponse['jwt-token']
        };

        this.jwtRepo.createJwt(jwtAuthenticated);

        return true;
      }),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  private errorHandler<T>(errorResponse: HttpErrorResponse, ret: T): Observable<T> {
    return of(ret as T);
  }
}
