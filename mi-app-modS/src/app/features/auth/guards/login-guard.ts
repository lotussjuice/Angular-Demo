import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Auth } from "../services/auth";
import { Router } from "@angular/router";

export const loginGuard: CanActivateFn = (route, state) => {
  let authService = inject(Auth);
  let router = inject(Router);

  if(!authService.isAuthenticated()){
    console.log("Usuario no autenticado, redirigiendo a login...");
    router.navigate(["/login"]);
    return false;
  }
  return true;
};
