import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Product } from "./product";
import { ProductList } from "./product/product-list/product-list";
import { FormsModule } from "@angular/forms";
import { computed } from "@angular/core";
import { ProductService } from "./product/product";
import { Weather } from "./services/weather";

@Component({
  selector: "app-root",
  imports: [
    //RouterOutlet,
    ProductList,
    FormsModule,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("mi-app-modS");
  listFilter = signal("");

  products = signal<Product[]>([]);
  weatherData = signal<any>(null);

  constructor(
    private productService: ProductService,
    private weatherService: Weather,
  ) {}

  filteredProducts = computed(() =>
    this.products().filter((p) =>
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase()),
    ),
  );

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products.set(products);
      console.log(this.products());
    });
    this.weatherService.getWeather("Chillan", "CL").subscribe((data: any) => {
      console.log(data);
      this.weatherData.set(data);
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
}
