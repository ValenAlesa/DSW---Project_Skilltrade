import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.js';
import { map, Observable, tap } from 'rxjs';
import { Publicacion } from '../models/publicacion.model.js';


@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/publicaciones`;

  constructor(private http: HttpClient) { }

  getPublicaciones(filters: { from?: string, to?: string }): Observable<Publicacion[]> {
    let params = new HttpParams();

    if (filters?.from) {
      params = params.set('from', filters.from);
    }

    if (filters?.to) {
      params = params.set('to', filters.to);
    }

    const url = `${this.apiUrl}`;
    console.log('[PublicacionService] GET', url, 'with params', params.toString());

    return this.http.get(url, { params, observe: 'response' }).pipe(
      tap((httpResp) => {
        console.log('[PublicacionService] Response Status:', httpResp.status);
        console.log('[PublicacionService] Response Body:', httpResp.body);
      }),
      map((httpResp) => {
        const body = httpResp.body;
        const data = Array.isArray(body) ? body : (body as any)?.data;
        if (!Array.isArray(data)) {
          throw new Error('Respuesta no es array ni tiene propiedad data');
        }
        return data as Publicacion[];
      })
    );
  }

  getPublicacion(id: number): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.apiUrl}/${id}`);
  }
}