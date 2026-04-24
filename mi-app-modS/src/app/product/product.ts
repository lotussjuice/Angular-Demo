import { Injectable } from "@angular/core";
import { Product } from "../product";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: "root",
})
export class ProductService {
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

}
