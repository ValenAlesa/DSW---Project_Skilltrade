import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { map, Observable, tap } from 'rxjs';
import { Publicacion, PublicacionCreate } from '../models/publicacion.model.js';


@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/publicaciones`;

  constructor(private http: HttpClient) { }

  crearPublicacion(body: PublicacionCreate) {
    return this.http.post<Publicacion>(this.apiUrl, body);
  }

  getPublicaciones( from?: string | null, to?: string | null ): Observable<Publicacion[]> {
    let params = new HttpParams();

    if (from) {
      params = params.set('from', from);
    }

    if (to) {
      params = params.set('to', to);
    }

    return this.http.get
    <{ message: string; data: Publicacion[] } | Publicacion[]>(this.apiUrl, { params })
    .pipe(
      map((resp) => (
        Array.isArray(resp) ? resp : resp.data ?? []
      ))
    );
  }

  getPublicacion(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`);
  }
}