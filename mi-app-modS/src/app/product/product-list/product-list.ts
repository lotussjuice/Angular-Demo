import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Product } from '../../product';
import { Star } from './star/star';
import { UpperCasePipe, LowerCasePipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ImagePipe } from '../../shared/image-pipe';
import { switchMap } from 'rxjs';
import { ProductService } from '../product';

@Component({
  selector: 'app-product-list',
  imports: [Star, UpperCasePipe, LowerCasePipe, DatePipe, CurrencyPipe, ImagePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnChanges, OnDestroy {

  @Input('datos') products: Product[] = [];
  showImage: boolean = true;

  constructor(private productService: ProductService) {
    console.log('Hijo: constructor');
  }

  deleteProduct(productoId: number) {
    this.productService.deleteProduct(productoId).pipe(
      switchMap(() => this.productService.getProducts())
    ).subscribe({
      next: (products: Product[]) => {
        this.products = products;
      }
    });
  }

  editProduct(arg0: number) {
    let datos: any = {
      name: `Producto Actualizado `
    }
  }

  viewProduct(arg0: number) {
    throw new Error('Method not implemented.');
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    console.log('Hijo: ngOnInit');
  }

  ngOnChanges(): void {
    console.log('Hijo: ngOnChanges');
  }

  ngOnDestroy(): void {
    console.log('Hijo: ngOnDestroy');
  }
}