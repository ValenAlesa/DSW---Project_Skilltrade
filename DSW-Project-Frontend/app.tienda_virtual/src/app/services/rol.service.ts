import { Injectable } from '@angular/core';
import { LoginService } from './login.service.js';
import { map, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class RolService {

  constructor (private loginService: LoginService){}

  esAdmin(): Observable<boolean> {
    return this.loginService.currentUserData.pipe(
      map(user => user?.rol === 'ADMINISTRADOR')
    );
  }

  esCliente(): Observable<boolean> {
    return this.loginService.currentUserData.pipe(
      map(user => user?.rol === 'CLIENTE')
    );
  }

  getRol(): Observable<string> {
    return this.loginService.currentUserData.pipe(
      map(user => user?.rol || '')
    );
  }

}

