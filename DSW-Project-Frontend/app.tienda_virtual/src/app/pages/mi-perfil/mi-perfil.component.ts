import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service.js';
import { User } from '../../models/user.js';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
}) 

export class MiPerfilComponent implements OnInit {
  user: User | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private auth: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.loading = true;
    this.errorMsg = '';

    this.auth.currentUserData.subscribe({
      next: (userData) => {
        if (userData?.id) {
          this.user = userData;
          this.loading = false;
        } else {
          this.errorMsg = 'Debes iniciar sesión para ver tu perfil.';
          this.loading = false;
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.errorMsg = 'Error al cargar tu perfil.';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  getRolDisplay(): string {
    return this.user?.rol?.toUpperCase() || 'CLIENTE';
  }
}
  


