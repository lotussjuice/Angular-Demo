import { Component, inject, signal, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Auth } from "../../services/auth";

@Component({
  selector: "app-reset-password",
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./reset-password.html",
  styleUrl: "./reset-password.css",
})
export class ResetPassword implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resetForm!: FormGroup;
  token = signal('');
  successMessage = signal('');
  errorMessage = signal('');
  isLoading = signal(false);
  tokenInvalid = signal(false);

  ngOnInit() {
    const tokenParam = this.route.snapshot.queryParams['token'];
    if (!tokenParam) {
      this.tokenInvalid.set(true);
      return;
    }
    this.token.set(tokenParam);

    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirm = control.get('confirmPassword');
    if (password && confirm && password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  submit() {
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const newPassword = this.resetForm.value.newPassword!;

    this.authService.resetPassword(this.token(), newPassword).subscribe({
      next: (resp: any) => {
        this.isLoading.set(false);
        this.successMessage.set(resp.mensaje || 'Contraseña actualizada correctamente');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.mensaje || 'Error al restablecer la contraseña');
      }
    });
  }
}
