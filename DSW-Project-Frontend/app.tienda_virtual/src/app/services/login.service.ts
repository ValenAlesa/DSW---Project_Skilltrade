import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap} from 'rxjs';
import { environment } from '../../environments/environment.js';
import { LoginRequest } from '../models/loginRequest.js';
import { User } from '../models/user.js';


@Injectable({
  providedIn: 'root'
})

export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({id:0, rol:'',email:'', telefono:'', domicilio:''});

  constructor (private http: HttpClient){}

  login(credentials:LoginRequest): Observable<any> {
    return this.http.get<User>(`././assets/data.json`).pipe(
      tap((userData: User) => {
        this.currentUserLoginOn.next(true);
        this.currentUserData.next(userData);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }  

  get userData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
}


  
