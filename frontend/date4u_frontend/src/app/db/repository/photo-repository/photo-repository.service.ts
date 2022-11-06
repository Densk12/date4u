import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoRepositoryService {

  constructor(
    private http: HttpClient
  ) { }

  getPhotoByName(name: string): Observable<Blob | null> {
    return this.http.get(
      `${environment.apiURL}/photos/${name}`,
      { headers: new HttpHeaders({ 'Accept': 'image/jpeg' }), responseType: 'blob' }
    ).pipe(
      catchError((errorResponse: HttpErrorResponse): Observable<null> => {
        return this.errorHandler<null>(errorResponse, null);
      })
    );
  }

  private errorHandler<T>(errorResponse: HttpErrorResponse, ret: T): Observable<T> {
    return of(ret as T);
  }
  
}
