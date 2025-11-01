import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/loginRequest';
import { take } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  get email() { return this.loginForm.controls['email']; }
  get password() { return this.loginForm.controls['password']; }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loginError = '';

    this.loginService.login(this.loginForm.value as LoginRequest)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          console.log('Login exitoso', res);
          localStorage.setItem('token', res?.token ?? ''); // 👈 clave coherente con el guard
          this.router.navigate(['/main-page']);
        },
        error: (err: any) => {
          console.error('Error en login', err);
          this.loginError = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
        }
      });
  }
}
