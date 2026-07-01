import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductComponent } from "./features/products/components/product/product";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Router } from '@angular/router';
import { Login } from "./features/auth/components/login/login";
import { Auth as authService} from "./features/auth/services/auth";


@Component({
  selector: "app-root",
  standalone: true,  
  imports: [ProductComponent, RouterLink, RouterOutlet, Login],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})

export class App {
  protected readonly title = signal("mi-app-modS");  
  public authService = inject(authService);
  
  constructor(private router: Router){}

  isAuthRoute(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/forgot-password' || url === '/reset-password';
  }

  navegar(){
    this.router.navigate(['product/product-list']);
  }
  
}
