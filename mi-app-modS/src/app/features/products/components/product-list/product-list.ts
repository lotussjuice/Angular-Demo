import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  output,
} from "@angular/core";
import { Product } from "../../interfaces/product";
import { Star } from "./star/star";
import {
  UpperCasePipe,
  LowerCasePipe,
  DatePipe,
  CurrencyPipe,
} from "@angular/common";
import { ImagePipe } from "../../../../shared/image-pipe";
import { switchMap } from "rxjs";
import { ProductService } from "../../services/product";

@Component({
  selector: "app-product-list",
  imports: [
    Star,
    UpperCasePipe,
    LowerCasePipe,
    DatePipe,
    CurrencyPipe,
    ImagePipe,
  ],
  templateUrl: "./product-list.html",
  styleUrl: "./product-list.css",
})
export class ProductList implements OnInit, OnChanges, OnDestroy {
  @Input("datos") products: Product[] = [];
  showImage: boolean = true;
  updatedProducts = output<Product[]>();

  constructor(private productService: ProductService) {
    console.log("Hijo: constructor");
  }

  deleteProduct(productId: number) {
    console.log("Borrando producto:", productId);
    this.productService
      .deleteProduct(productId)
      .pipe(switchMap(() => this.productService.getProducts()))
      .subscribe({
        next: (products: Product[]) => {
          console.log("Llegó un dato");
          console.log("Producto eliminado:", productId);
          this.updatedProducts.emit(products);
        },
        error: (error: any) => {
          console.error("Error al borrar el producto:", error);
        },
        complete: () => console.log("Eliminación de producto completada"),
      });
  }

  editProduct(productId: number, product: Product) {
    let datos: any = {
      name: `Producto Actualizado ${Math.round(Math.random() * (100 - 1) + 1)}`,
      code: this.productService.generateProductCode(),
      date: "2024-01-01",
      price: Math.round(Math.random() * (40000 - 10000) + 10000),
      description: "Descripción del producto nuevo",
      rate: Math.round(Math.random() * (200 - 1) + 1),
      image: "gamuza_hush.jpg",
    };

    this.productService
      .updateProduct(productId, datos)
      .pipe(switchMap(() => this.productService.getProducts()))
      .subscribe({
        next: (products: Product[]) => {
          console.log("Llegó un dato");
          console.log("Producto actualizado:", productId);
          this.updatedProducts.emit(products);
        },
        error: (error: any) => {
          console.error("Error al actualizar el producto:", error);
        },
        complete: () => console.log("Actualización de producto completada"),
      });
  }

  viewProduct(productId: number) {
    console.log("Viendo producto:", productId);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    console.log("Hijo: ngOnInit");
  }

  ngOnChanges(): void {
    console.log("Hijo: ngOnChanges");
  }

  ngOnDestroy(): void {
    console.log("Hijo: ngOnDestroy");
  }
}
