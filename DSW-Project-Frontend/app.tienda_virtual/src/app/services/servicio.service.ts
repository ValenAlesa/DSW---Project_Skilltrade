import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root'
})

export class Servicio {

  private apiUrl = `${environment.apiUrl}/servicios`;

  constructor(private servicio: HttpClient) {
  }

  ConsultarServicios(): Observable<any> {
    return this.servicio.get(this.apiUrl);
  }
}
