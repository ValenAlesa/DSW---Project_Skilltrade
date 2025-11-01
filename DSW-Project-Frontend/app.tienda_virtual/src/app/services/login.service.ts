import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject, tap} from 'rxjs';
import { environment } from '../../environments/environment.js';
import { LoginRequest } from '../models/loginRequest.js';
import { User } from '../models/user.js';

interface AuthResponse {
  message: string;
  data: { user: User };
  token: string;
}

interface RegisterBody {
  username?: string;
  email: string;
  password: string;
  telefono?: string;
  domicilio?: string;
  ciudad_id?: number;
  rol?: string;
}


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiBase = `${environment.apiUrl}/usuarios`;
  
  private INIT_USER: User = {
    id:0, 
    username:'',
    rol:'',
    email:'', 
    telefono:'', 
    domicilio:'',
    ciudad_id:0
  } as User;

  private _currentUserLoginOn$ = new BehaviorSubject<boolean>(false);
  private _currentUserData$ = new BehaviorSubject<User>(this.INIT_USER);

  currentUserLoginOn = this._currentUserLoginOn$.asObservable();
  currentUserData = this._currentUserData$.asObservable();

  constructor (private http: HttpClient){}

  register(data: any) {
  return this.http.post(`${this.apiBase}/register`, data)
    .pipe(
      tap(() => localStorage.removeItem('token'))
    );
}

  private ensureSubjectsOpen() {
    if (this._currentUserLoginOn$.closed) {
      this._currentUserLoginOn$ = new BehaviorSubject<boolean>(false);
    }
    if (this._currentUserData$.closed) {
      this._currentUserData$ = new BehaviorSubject<User>(this.INIT_USER);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    
    const url = `${this.apiBase}/login`;

    return this.http.post<AuthResponse>(url, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        this.ensureSubjectsOpen();
        this._currentUserLoginOn$.next(true);
        this._currentUserData$.next(response.data.user);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this._currentUserLoginOn$.next(false);
    this._currentUserData$.next({
      id:0, 
      username:'', 
      rol:'', 
      email:'', 
      telefono:'', 
      domicilio:'', 
      ciudad_id:0
    } as User);
  }

  private handleError(error: any) {
  
if (error?.status !== undefined) {
  if (error.status === 0) {
    console.error('Network/client error:', error);
  } else {
    console.error(`Backend returned code ${error.status}, body was:`, error.error);
  }

  return throwError(() => error);
}

console.error('An unexpected error occurred:', error);
return throwError(() => error);
  }


  get userData(): Observable<User> {
    return this._currentUserData$.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this._currentUserLoginOn$.asObservable();
  }
}


  
