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
  publicacionesFiltradas: Publicacion[] = [];
  pubSeleccionada?: Publicacion;
  
  /* Formulario de reserva */
  reservaForm!: FormGroup;
  showReserva = false;

  loading = false;
  errorMsg = '';
  
  /* Filtro por fecha */
  filtro!: FormGroup;

  /* Búsqueda por texto */
  searchText = '';

  /*Min fecha*/
  minFecha = new Date().toISOString().slice(0,10);

  /* Usuario logueado */
  user?: User | null;

  /* Mapeo de servicios con emojis */
  private servicioMap: Record<number, { nombre: string; emoji: string }> = {
    1: { nombre: 'Limpieza', emoji: '🧹' },
    2: { nombre: 'Plomería', emoji: '🔧' },
    3: { nombre: 'Electricidad', emoji: '⚡' },
    4: { nombre: 'Jardinería', emoji: '🌱' },
    5: { nombre: 'Pintura', emoji: '🎨' },
    6: { nombre: 'Carpintería', emoji: '🔨' },
    7: { nombre: 'Albañilería', emoji: '🧱' },
    8: { nombre: 'Tecnología', emoji: '💻' },
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
      next: (data: Publicacion[]) => {
        this.publicaciones = data ?? [];
        this.aplicarBusquedaTexto();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar las publicaciones.';
        this.publicaciones = [];
        this.publicacionesFiltradas = [];
      },
      complete: () => (this.loading = false),
    });


  }

  filtrarPublicaciones(): void {
    
    this.buscarPublicaciones();
  }

  limpiar(): void {
    this.filtro.reset();
    this.searchText = '';
    this.buscarPublicaciones();
  }

  /*---- Búsqueda por texto ----*/
  onSearchChange(text: string): void {
    this.searchText = text;
    this.aplicarBusquedaTexto();
  }

  private aplicarBusquedaTexto(): void {
    if (!this.searchText.trim()) {
      this.publicacionesFiltradas = [...this.publicaciones];
      return;
    }

    const search = this.searchText.toLowerCase().trim();
    this.publicacionesFiltradas = this.publicaciones.filter(pub => {
      const titulo = pub.titulo?.toLowerCase() || '';
      const descripcion = pub.descripcion?.toLowerCase() || '';
      const nombreServicio = this.getNombreServicio(pub.servicio_id).toLowerCase();
      
      return titulo.includes(search) || 
             descripcion.includes(search) || 
             nombreServicio.includes(search);
    });
  }

  /*---- Obtener nombre del servicio ----*/
  getNombreServicio(servicio_id: number): string {
    return this.servicioMap[servicio_id]?.nombre ?? 'Servicio';
  }

  /*---- Obtener emoji del servicio ----*/
  getEmojiServicio(servicio_id: number): string {
    return this.servicioMap[servicio_id]?.emoji ?? '🛠️';
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

