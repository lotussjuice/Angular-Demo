import { Component, signal, computed } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { switchMap } from "rxjs";
import { Product } from "../../interfaces/product";
import { ProductService as ProductService} from "../../services/product";
import { ModalAdd } from "./modal-add/modal-add";
import { ProductList } from "./product-list/product-list";



@Component({
  selector: "app-product",
  imports: [FormsModule, ModalAdd, ProductList],
  templateUrl: "./product.html",
  styleUrl: "./product.css",
})
export class ProductComponent {

  listFilter = signal("");
  isModalOpen = signal(false);

  constructor(public productService: ProductService) {}

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


