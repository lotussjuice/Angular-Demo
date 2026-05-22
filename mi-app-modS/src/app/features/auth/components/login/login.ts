import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})

export class Login {
  private formBuilder = inject(FormBuilder);
  private loginService = inject(Auth)

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  login(){
    let email: any = this.loginForm.value.email;
    let password: any = this.loginForm.value.password;
    this.loginService.login(email, password).subscribe(
      data => {
        console.log("Login exitoso", data);
      }
    );
  }
}
