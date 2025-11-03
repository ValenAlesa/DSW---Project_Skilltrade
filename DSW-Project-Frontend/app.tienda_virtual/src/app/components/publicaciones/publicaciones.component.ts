import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../services/publicacion.service.js';
import { Publicacion } from '../../models/publicacion.model.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service.js';
import { User } from '../../models/user.js';
import { LoginService } from '../../services/login.service.js';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
})
export class PublicacionesComponent implements OnInit {

  publicaciones: Publicacion[] = [];
  pubSeleccionada?: Publicacion;
  
  /* Formulario de reserva */
  reservaForm!: FormGroup;
  showReserva = false;

  loading = false;
  errorMsg = '';
  
  /* Filtro por fecha */
  filtro!: FormGroup;

  /*Min fecha*/
  minFecha = new Date().toISOString().slice(0,10);

  /* Usuario logueado */
  user?: User | null;

  /* Mapeo de servicios */
  private servicioMap: Record<number, { nombre: string }> = {
    1: { nombre: 'Limpieza' },
    2: { nombre: 'Plomería' },
    3: { nombre: 'Electricidad' },
    4: { nombre: 'Jardinería' },
    5: { nombre: 'Pintura' },
  };



  constructor(
    private fb: FormBuilder, 
    private publicacion: PublicacionService,
    private router: Router,
    private reserva: ReservaService,
    private auth: LoginService,
    
  ) {}

  

  ngOnInit(): void {
    this.auth.currentUserData.subscribe(user => 
        this.user = user);
    this.filtro = this.fb.group({
      from: [''],
      to: ['']
    });

    /*---- Form de reserva ----*/
    this.reservaForm = this.fb.group({
      fecha_reserva: ['', Validators.required],
      notas: [''],
    });

    this.buscarPublicaciones();
  }

  private norm(v?: string | null): string | null {
    if (!v) return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  }

  buscarPublicaciones(): void {
    this.loading = true;
    this.errorMsg = '';

    const { from, to} = this.filtro.value as
    { from?: string; to?: string};
    const f = this.norm(from);
    const t = this.norm(to);

    this.publicacion.getPublicaciones(f, t).subscribe({
      next: (data: Publicacion[]) => 
      (this.publicaciones = data ?? []),
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar las publicaciones.';
        this.publicaciones = [];
      },
      complete: () => (this.loading = false),
    });


  }

  filtrarPublicaciones(): void {
    
    this.buscarPublicaciones();
  }

  limpiar(): void {
    this.filtro.reset();
    this.buscarPublicaciones();
  }

  /*---- Obtener nombre del servicio ----*/
  getNombreServicio(servicio_id: number): string {
    return this.servicioMap[servicio_id]?.nombre ?? 'Servicio';
  }


  /*---- Reserva ----*/
  abrirReserva(pub: Publicacion) {
    this.pubSeleccionada = pub;
    this.reservaForm.reset({
      fecha_reserva: '',
      notas: '',
    });
    this.showReserva = true;
  }


  cerrarReserva(): void {
    this.showReserva = false;
    this.pubSeleccionada = undefined;
    this.reservaForm?.reset();
    document.body.style.overflow = '';
  }

  confirmarReserva(): void {
    if (!this.pubSeleccionada?.id) {
      alert('No se ha encontrado ninguna publicación para reservar.');
      return;
    }
    if (!this.user?.id) {
      alert('Debe iniciar sesión para realizar una reserva.');
      return;
    }

    const body = {
      fecha_reserva: this.reservaForm.value.fecha_reserva,
      estado: 'pendiente' as const,
      precio: Number(this.pubSeleccionada!.precio),
      notas: this.reservaForm.value.notas || '',
      publicacion_id: this.pubSeleccionada!.id,
      cliente_id: this.user!.id,
    };

    console.log('[POST reserva] body:', body);

    this.loading = true;
    this.reserva.crear(body).subscribe({
      next: () => {
        this.loading = false;
        this.cerrarReserva();

        alert('Reserva creada con éxito.');
      },
      error: (err) => {
        this.loading = false;
        console.error('[Reserva] HTTP ERROR:', err?.status, err?.error);
        alert(err?.error?.message || 'Error al crear la reserva. Intente nuevamente.');
      },
    });
  }
}

