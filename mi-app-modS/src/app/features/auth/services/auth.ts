import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class Auth {
  isAuthenticated = signal(false);
  private http = inject(HttpClient);
  private apiUrl = environment.apiEndpoint;

  public constructor() {
    this.isAuthenticated.set(!!localStorage.getItem("token"));
  }

  private router = inject(Router);

  login(email: string, password: string) {
    let userLogin = { email: email, password: password };
    return this.http.post(`${this.apiUrl}/login`, userLogin).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        this.isAuthenticated.set(true);
        this.router.navigate(["/home"]);
      }));
  }

  public logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.isAuthenticated.set(false);
    this.router.navigate(["/login"]);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/usuarios`, { name, email, password, role: 'user' });
  }

  public loginGoogle(token: string) {
    const header = { 'Content-Type': 'application/json' };
    let googleToken = { token: token };
    return this.http.post(`${this.apiUrl}/google-login`, googleToken, { headers: header }).pipe(
      map((resp: any) => {
        console.log('Login with Google successful:', resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));
        this.isAuthenticated.set(true);
        this.router.navigate(['/home']);
      }));
  }

}

