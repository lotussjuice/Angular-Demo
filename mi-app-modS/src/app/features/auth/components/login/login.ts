import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Auth } from "../../services/auth";
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule, GoogleSigninButtonModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})

export class Login implements OnInit {
  private formBuilder = inject(FormBuilder);
  private loginService = inject(Auth);
  private socialAuthService = inject(SocialAuthService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user: SocialUser | null) => {
      if (user) {
        this.loginService.loginGoogle(user.idToken!).subscribe({
          next: (data) => {
            console.log('Google login successful:', data);
          }
        });
      }
    });
  }

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
