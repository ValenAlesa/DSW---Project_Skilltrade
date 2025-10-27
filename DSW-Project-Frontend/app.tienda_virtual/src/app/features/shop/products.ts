import { Injectable } from '@angular/core';
import { ApiHttp } from '../../core/api-http'; 
import { Observable } from 'rxjs';
import { Product } from '../../core/models'; 

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private apiHttp: ApiHttp) {}
  list(params?: { q?: string }): Observable<Product[]> {
    return this.apiHttp.get<Product[]>('/products', { params });
  }
  byId(id: number): Observable<Product> {
    return this.apiHttp.get<Product>(`/products/${id}`);
  }
  
}