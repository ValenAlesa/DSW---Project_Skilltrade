import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiHttp {
  private baseUrl = 'your-api-base-url'; 

  constructor(private http: HttpClient) {}

  get<T>(path: string, options?: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe?: 'body'; responseType?: 'json' }): Observable<T>;
  get<T>(path: string, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'response'; responseType?: 'json' }): Observable<HttpResponse<T>>;
  get<T>(path: string, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'events'; responseType?: 'json' }): Observable<HttpEvent<T>>;
  get<T>(path: string, options?: any): Observable<any> {
    return this.http.get<T>(`${this.baseUrl}${path}`, options);
  }

  post<T>(path: string, body: any, options?: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe?: 'body'; responseType?: 'json' }): Observable<T>;
  post<T>(path: string, body: any, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'response'; responseType?: 'json' }): Observable<HttpResponse<T>>;
  post<T>(path: string, body: any, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'events'; responseType?: 'json' }): Observable<HttpEvent<T>>;
  post<T>(path: string, body: any, options?: any): Observable<any> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, options);
  }

  put<T>(path: string, body: any, options?: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe?: 'body'; responseType?: 'json' }): Observable<T>;
  put<T>(path: string, body: any, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'response'; responseType?: 'json' }): Observable<HttpResponse<T>>;
  put<T>(path: string, body: any, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'events'; responseType?: 'json' }): Observable<HttpEvent<T>>;
  put<T>(path: string, body: any, options?: any): Observable<any> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, options);
  }

  delete<T>(path: string, options?: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe?: 'body'; responseType?: 'json' }): Observable<T>;
  delete<T>(path: string, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'response'; responseType?: 'json' }): Observable<HttpResponse<T>>;
  delete<T>(path: string, options: { params?: HttpParams | { [k: string]: any }; headers?: HttpHeaders | { [k: string]: any }; observe: 'events'; responseType?: 'json' }): Observable<HttpEvent<T>>;
  delete<T>(path: string, options?: any): Observable<any> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, options);
  }
}
