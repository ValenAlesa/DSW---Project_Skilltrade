import { Component, OnInit } from '@angular/core';
import { FormBuilder , Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service.js';
import { LoginRequest } from '../../models/loginRequest.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm: any;
  loginError: string="";

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {
     this.loginForm = this.fb.group({
       email: ['martiniano1567@gmail.com', [Validators.required, Validators.email]],
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
      if(this.loginForm.valid){
        this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
          next: (userData) => {
            console.log("Login exitoso", userData);
          },
          error: (errorData) => {
            console.error("Error en el login", errorData);
            this.loginError = "Error en el login: " + errorData.message;
          },
          complete: () => {
            console.log("Proceso de login completado");
            this.router.navigate(['/main-page']);
            this.loginForm.reset();
        }
      });
      }
      else {
        this.loginForm.markAllAsTouched();
        console.log("Error al ingresar los datos");
      }
    }
}