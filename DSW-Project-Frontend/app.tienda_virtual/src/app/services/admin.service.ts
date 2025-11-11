import { environment } from "../../environments/environment.js"
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.js";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AdminService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  // Con esto obtengo todos los usuarios
  getUsuarios(): Observable<User[]> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data || [])
      ); 
  }

  // Creo usuario 
  crearUsuario(userData: any): Observable<User> {
    return this.http.post<{ data: User }>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => response.data)
      );
  }
  
  updateUsuario(id: number, body: Partial<User>): Observable<User> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/${id}`, body)
      .pipe(
        map(response => response.data)
      );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}