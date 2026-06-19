import { Component, signal, computed } from "@angular/core";
import { faker } from "@faker-js/faker";
import { DatePipe, NgFor, NgClass } from "@angular/common";

@Component({
  selector: "app-product-pagination",
  imports: [DatePipe, NgFor, NgClass],
  templateUrl: "./product-pagination.html",
  styleUrl: "./product-pagination.css",
})
export class ProductPagination {
  products: any[] = [];
  currentPage = signal(1);
  itemsPerPage = 10;

  constructor() {
    this.products = Array(50)
      .fill(1)
      .map(() => {
        return {
          image: faker.image.url(),
          productName: faker.commerce.productName(),
          productCode: faker.string.numeric(8),
          price: faker.commerce.price(),
          createdAt: faker.date.past(),
        };
      });
  }

  totalPages = computed(() => Math.ceil(this.products.length / this.itemsPerPage));

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  });

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }
}
