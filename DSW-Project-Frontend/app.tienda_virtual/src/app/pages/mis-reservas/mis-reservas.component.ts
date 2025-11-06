import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service.js';
import { LoginService } from '../../services/login.service.js';
import { ReservaModel } from '../../models/reserva.model.js';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css'],
})
export class MisReservasComponent implements OnInit {
  reservas: ReservaModel[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private reservaService: ReservaService,
    private auth: LoginService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;
    this.errorMsg = '';

    this.auth.currentUserData.subscribe(user => {
      if (user?.id) {
        this.reservaService.misreservas(user.id).subscribe({
          next: (response) => {
            this.reservas = response.data || [];
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar reservas:', err);
            this.errorMsg = 'Error al cargar tus reservas.';
            this.loading = false;
          },
        });
      } else {
        this.loading = false;
        this.errorMsg = 'Debes iniciar sesión.';
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'pendiente':
        return 'estado-pendiente';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return '';
    }
  }
}
