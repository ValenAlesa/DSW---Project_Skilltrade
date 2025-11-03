import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, ValidationErrors, AbstractControl, Validators, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { LoginService } from '../../services/login.service.js';
import { Router, RouterLink } from '@angular/router';

export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const p1 = group.get('password')?.value ?? '';
  const p2 = group.get('confirmPassword')?.value ?? '';
  if (!p1 && !p2) return null;
  return p1 === p2 ? null : { mismatch: true };
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})

export class RegisterComponent {
  errorMsg = '';
  form: FormGroup;
  
  constructor(private fb: FormBuilder, private auth: LoginService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
  }, { validators: passwordsMatch }),
  username: [''],
  telefono: [''],
  domicilio: [''],
  });
  
}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    localStorage.removeItem('token');
    const { email, username, telefono, domicilio } = this.form.value;
    const password = this.form.value.passwordGroup?.password!;

    this.auth.register({ username: username || email, email, password, telefono, domicilio }).subscribe({
        next: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        this.errorMsg = err.error?.message || 'No se pudo registrar el usuario';
      }
    });
  }

}
