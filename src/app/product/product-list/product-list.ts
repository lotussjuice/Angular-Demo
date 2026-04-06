import { Component, Input} from '@angular/core';
import { Product } from '../../product';

@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @Input('datos') products: Product[] = [];
  
  showImage : boolean = true;
  toggleImage(): void {
    this.showImage = !this.showImage;
  }
}
