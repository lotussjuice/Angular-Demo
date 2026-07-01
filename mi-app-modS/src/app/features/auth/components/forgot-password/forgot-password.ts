import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-forgot-password",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.html",
  styleUrl: "./forgot-password.css",
})
export class ForgotPassword {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  forgotForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  submit() {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const email = this.forgotForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: (resp: any) => {
        this.isLoading.set(false);
        this.successMessage.set(resp.mensaje || 'Si el email existe, se ha enviado un enlace de recuperación');
        this.forgotForm.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.mensaje || 'Error al enviar el correo de recuperación');
      }
    });
  }
}
