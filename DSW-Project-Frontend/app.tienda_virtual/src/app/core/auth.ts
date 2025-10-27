import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiHttp } from './api-http.js';
import { LoginDTO, LoginResponse, User } from './models.js'

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _user$ = new BehaviorSubject<User | null>(this.restoreUser());
  user$ = this._user$.asObservable();

  get token() {
    return localStorage.getItem(TOKEN_KEY);
  }
  isLoggedIn() {
    return !!this.token;
  }

  constructor(private apiHttp: ApiHttp) {}

  login(payload: LoginDTO) {
    return this.apiHttp.post<LoginResponse>('/auth/login', payload).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._user$.next(res.user);
      })
    );
  }
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user$.next(null);
  }

  private restoreUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : null;
  }
}
