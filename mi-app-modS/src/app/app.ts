import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Product } from "./features/products/interfaces/product";
import { ProductList } from "./features/products/components/product-list/product-list";
import { FormsModule } from "@angular/forms";
import { computed } from "@angular/core";
import { ProductService } from "./features/products/services/product";
import { switchMap } from "rxjs";
import { ModalAdd } from "./features/products/components/modal-add/modal-add";

@Component({
  selector: "app-root",
  imports: [
    //RouterOutlet,
    ProductList,
    FormsModule,
    ModalAdd
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("mi-app-modS");
  listFilter = signal("");
  isModalOpen = signal(false);

  constructor(
    public productService: ProductService
  ) {}

  abrirModal(){
    console.log('Abriendo modal');
    this.isModalOpen.set(true);
    console.log(this.isModalOpen());
  }

  cerrarModal(){
    console.log('Cerrando modal');
    this.isModalOpen.set(false);
  }

  filteredProducts = computed(() =>
    this.productService.products().filter((p) =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase()),
    ),
  );

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.productService.products.set(products);
      console.log(this.productService.products());
    });
  }

  ngOnChanges(): void {
    console.log("Padre: ngOnChanges");
  }

  ngOnDestroy(): void {
    console.log("Padre: ngOnDestroy");
  }

  showChildren = signal(true);
  toggleChildren(): void {
    this.showChildren.update((value) => !value);
  }

  crearProducto() {
    let datos: any = {
      name: `Producto Nuevo ${Math.round(Math.random() * (100 - 1) + 1)}`,
      code: this.productService.generateProductCode(),
      date: "2024-01-01",
      price: Math.round(Math.random() * (40000 - 10000) + 10000),
      description: "Descripción del producto nuevo",
      rate: Math.round(Math.random() * (200 - 1) + 1),
      image: "gamuza_hush.jpg",
    };
    this.guardarProducto(datos);
  }

  guardarProducto(product: Product){
    console.log('Guardando producto: ', product);
    this.productService.saveProduct(product).pipe(
      switchMap(() => this.productService.getProducts())
    ).subscribe(products => this.productService.products.set(products));
  }
}
