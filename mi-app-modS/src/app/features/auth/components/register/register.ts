import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-register",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./register.html",
  styleUrl: "./register.css",
})
export class Register {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (password && confirm && password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  submit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name!, email!, password!).subscribe({
      next: (resp: any) => {
        this.isLoading.set(false);
        this.successMessage.set(resp.mensaje || 'Usuario registrado correctamente');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.mensaje || 'Error al registrar usuario');
      }
    });
  }
}
