import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Servicio {
  id?: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminServiciosService {
  private apiUrl = `${environment.apiUrl}/servicios`;

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.data || response)
    );
  }

  crearServicio(servicioData: Servicio): Observable<Servicio> {
    return this.http.post<any>(this.apiUrl, servicioData).pipe(
      map(response => response.data || response)
    );
  }

  updateServicio(id: number, body: any): Observable<Servicio> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, body).pipe(
      map(response => response.data || response)
    );
  }

  deleteServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
