import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../../model/Photo';
import { Profile } from '../../model/Profile';
import { SearchFilter } from '../../model/SearchFilter';
import { SearchResult } from '../../model/SearchResult';

@Injectable({
  providedIn: 'root'
})
export class ProfileRepositoryService {

  constructor(
    private http: HttpClient
  ) { }

  getProfileById(id: number): Observable<Profile | null> {
    return this.http.get(
      `${environment.apiURL}/profiles/${id}`,
      { headers: new HttpHeaders({ accept: 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): Profile => {
        const profile: Profile = {
          id: jsonResponse.id,
          nickname: jsonResponse.nickname,
          birthday: jsonResponse.birthday,
          hornlength: jsonResponse.hornlength,
          gender: jsonResponse.gender,
          attractedToGender: jsonResponse['attracted-to-gender'],
          description: jsonResponse.description
        };

        return profile;
      }),
      catchError((errorResponse: HttpErrorResponse): Observable<null> => {
        return this.errorHandler<null>(errorResponse, null);
      })
    );
  }

  getProfilesByFilterCriterias(id: number, searchFilter: SearchFilter): Observable<SearchResult | null> {
    return this.http.get(
      // url
      `${environment.apiURL}/profiles/${id}?` +
      `age-start=${searchFilter.ageStart}&age-end=${searchFilter.ageEnd}&` +
      `hornlength-start=${searchFilter.hornlengthStart}&hornlength-end=${searchFilter.hornlengthEnd}&` +
      `gender=${searchFilter.gender}&page=${searchFilter.page}&page-size=${searchFilter.pageSize}`,
      // header
      { headers: new HttpHeaders({ 'Accept': 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): SearchResult => {
        const searchResult: SearchResult = {} as any;

        searchResult.profilesPage = jsonResponse['profiles-page'].map((pJSON: any): Profile => {
          const profile: Profile = {
            id: pJSON.id,
            nickname: pJSON.nickname,
            birthday: pJSON.birthday,
            hornlength: pJSON.hornlength,
            gender: pJSON.gender,
            attractedToGender: pJSON['attracted-to-gender'],
            description: pJSON.description
          };

          return profile;
        });

        searchResult.countAllProfiles = jsonResponse['count-all-profiles'];
        searchResult.currentPage = jsonResponse['current-page'];

        return searchResult;
      }),
      catchError((errorResponse: HttpErrorResponse): Observable<null> => {
        return this.errorHandler<null>(errorResponse, null);
      })
    );
  }

  getProfilesLikedByProfileId(id: number): Observable<Profile[] | null> {
    return this.http.get(
      `${environment.apiURL}/profiles/${id}/likes`,
      { headers: new HttpHeaders({ accept: 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): Profile[] => {
        return jsonResponse.map((pJSON: any) => {
          const profile: Profile = {
            id: pJSON.id,
            nickname: pJSON.nickname,
            birthday: pJSON.birthday,
            hornlength: pJSON.hornlength,
            gender: pJSON.gender,
            attractedToGender: pJSON['attracted-to-gender'],
            description: pJSON.description
          };

          return profile;
        });
      }),
      catchError((errorResponse: HttpErrorResponse): Observable<null> => {
        return this.errorHandler<null>(errorResponse, null);
      })
    );
  }

  createLikedProfileByProfileId(id: number, profileLikedId: number): Observable<boolean> {
    return this.http.post(
      `${environment.apiURL}/profiles/${id}/likes/${profileLikedId}`,
      {}
    ).pipe(
      map((): boolean => true),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  getPhotosByProfileId(id: number): Observable<Photo[] | null> {
    return this.http.get(
      `${environment.apiURL}/profiles/${id}/photos`,
      { headers: new HttpHeaders({ 'Accept': 'application/json' }) }
    ).pipe(
      map((jsonResponse: any): Photo[] => jsonResponse.map((photoJSON: any): Photo => {
        const photo: Photo = {
          name: photoJSON.name,
          profilePhoto: photoJSON['profile-photo']
        };

        return photo;
      })),
      catchError((errorResponse: HttpErrorResponse): Observable<null> => {
        return this.errorHandler<null>(errorResponse, null);
      })
    );
  }

  createPhotoByProfileId(id: number, photo: File, profilePhoto: boolean): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('image', photo, photo.name);
    
    return this.http.post(
      `${environment.apiURL}/profiles/${id}/photos?profile-photo=${profilePhoto}`,
      formData,
      { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) }
    ).pipe(
      map((): boolean => true),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  updateProfileById(id: number, profile: Profile): Observable<boolean> {
    return this.http.put(
      `${environment.apiURL}/profiles/${id}`,
      {
        id: id,
        nickname: profile.nickname,
        birthday: profile.birthday,
        hornlength: profile.hornlength,
        gender: profile.gender,
        'attracted-to-gender': profile.attractedToGender,
        description: profile.description
      },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      map((): boolean => true),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  deleteProfileLiked(id: number, profileLikedId: number): Observable<boolean> {
    return this.http.delete(
      `${environment.apiURL}/profiles/${id}/likes/${profileLikedId}`
    ).pipe(
      map((): boolean => true),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  deleteProfileById(id: number): Observable<boolean> {
    return this.http.delete(
      `${environment.apiURL}/profiles/${id}`
    ).pipe(
      map((): boolean => true),
      catchError((errorResponse: HttpErrorResponse): Observable<boolean> => {
        return this.errorHandler<boolean>(errorResponse, false);
      })
    );
  }

  private errorHandler<T>(errorResponse: HttpErrorResponse, ret: T): Observable<T> {
    return of(ret as T);
  }
}
