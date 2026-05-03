import { Injectable, signal } from "@angular/core";
import { Product } from "../interfaces/product";
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from "rxjs";
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: "root",
})
export class ProductService {
  products = signal<Product[]>([]);

  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<Product[]> {
    console.log('Fetching products from API...');
    return this.http.get<Product[]>(`http://localhost:3000/productos`).pipe(
      map((resp: any) => resp.productos)
    );
  }

  deleteProduct(id: number): Observable<void>{
    return this.http.delete<void>(`http://localhost:3000/productos/${id}`);
  }

  generateProductCode(): string {
    const randomNum = Math.floor(Math.random() * (100 - 1) + 1);
    return `PROD${randomNum.toString().padStart(3, '0')}`;
  }

  saveProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`http://localhost:3000/productos`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`http://localhost:3000/productos/${id}`, product);
  }

  searchProduct(code: string){
    return timer(1000).pipe(switchMap(() => {
      return this.http.get<any>(`http://localhost:3000/existeproducto/${code}`).pipe(
        map((resp: any) => resp.data)
      );
    }));
  }
}
