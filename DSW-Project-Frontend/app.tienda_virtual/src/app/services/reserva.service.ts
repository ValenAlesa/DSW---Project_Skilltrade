import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaModel, ReservaCreate } from '../models/reserva.model';
import { environment } from '../../environments/environment.js';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
 private urlApi = `${environment.apiUrl}/reservas`;

 constructor(private http: HttpClient) {}

  crear(dto: ReservaCreate): Observable<ReservaModel> {
    return this.http.post<ReservaModel>(this.urlApi, dto);
  
}

  misreservas(usuarioId: number) {
    return this.http.get<{data: ReservaModel[]}>(`${this.urlApi}/usuarios/${usuarioId}`);

  }
}