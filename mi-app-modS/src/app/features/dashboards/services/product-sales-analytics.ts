import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../products/interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSalesAnalytics {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getSales() {
    return [
      {"name": "Móviles", "value": 100000},
      {"name": "Notebooks", "value": 55000},
      {"name": "Estufas", "value": 15000},
      {"name": "Televisores", "value": 150000},
      {"name": "Refrigeradores", "value": 20000},
    ]
  }

  getTop5Products(): Observable<{name: string, value: number}[]> {
    let token = localStorage.getItem("token") || '';
    return this.http.get<Product[]>(`${this.apiUrl}/productos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      map((resp: any) => {
        const products = resp.productos || resp;
        return products
          .sort((a: Product, b: Product) => b.starRating - a.starRating)
          .slice(0, 5)
          .map((p: Product) => ({ name: p.productName, value: p.starRating }));
      })
    );
  }
}
