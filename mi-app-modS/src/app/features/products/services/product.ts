import { Injectable, signal } from "@angular/core";
import { Product } from "../interfaces/product";
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: "root",
})
export class ProductService {
  products = signal<Product[]>([]);
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    let token = localStorage.getItem("token") || '';
    return { 'Authorization': `Bearer ${token}` };
  }
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/productos`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map((resp: any) => resp.productos)
    );
  }

  deleteProduct(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/productos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  generateProductCode(): string {
    const randomNum = Math.floor(Math.random() * (100 - 1) + 1);
    return `PROD${randomNum.toString().padStart(3, '0')}`;
  }

  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/productos`, product, {
      headers: this.getAuthHeaders()
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/productos/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  searchProduct(code: string){
    return timer(1000).pipe(switchMap(() => {
      return this.http.get<any>(`${this.apiUrl}/existeproducto/${code}`, {
        headers: this.getAuthHeaders()
      }).pipe(
        map((resp: any) => resp.data)
      );
    }));
  }
}
