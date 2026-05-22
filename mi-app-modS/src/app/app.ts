import { Component, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductComponent } from "./features/products/components/product/product";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Router } from '@angular/router';
import { Login } from "./features/auth/components/login/login";
import { Auth } from "./features/auth/services/auth";


@Component({
  selector: "app-root",
  standalone: true,  
  imports: [ProductComponent, RouterLink, RouterOutlet, Login],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})

export class App {
  protected readonly title = signal("mi-app-modS");  
  public authService = inject(Auth);
  
  constructor(private router: Router){}

  navegar(){
    this.router.navigate(['product/product-list']);
  }
  
}
