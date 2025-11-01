import { Component, OnInit } from '@angular/core';
import { FormBuilder , Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service.js';
import { LoginRequest } from '../../models/loginRequest.js';
import { RouterModule } from '@angular/router';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  loginError: string = '';

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
     this.loginForm = this.fb.group({
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]]
     });
   }

  ngOnInit(): void {
    }

    get email() {
      return this.loginForm.controls['email'];
    }
    
    get password() {
      return this.loginForm.controls['password'];
    }

    login(){
      if(this.loginForm.invalid){
        this.loginForm.markAllAsTouched();
        return;
      }

      this.loginError  = '';

      this.loginService.login(this.loginForm.value as LoginRequest).pipe(take(1)).subscribe({
        next: (userData) => {
          console.log("Login exitoso", userData);

        const token = localStorage.getItem('authToken');
        if (token) {
          this.router.navigate(['/main-page']);
        } else {
          this.loginError = 'No se recibió el token de autenticación.';
        }
        },
        error: (error: any) => {
          console.error("Error en login", error);
          this.loginError = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
        }
        
          
      });
    }
}

      