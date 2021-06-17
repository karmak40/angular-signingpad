import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

@Injectable()
export class SaveService {
  constructor(private http: HttpClient) { }

  saveImageUrl = 'assets/config.json';


  /** PUT: update the hero on the server */
  saveImageData(data: string): Observable<any> {
    return this.http.put(this.saveImageUrl, data)
  }

  
}