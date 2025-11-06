import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../services/publicacion.service.js';
import { Publicacion, PublicacionCreate } from '../../models/publicacion.model.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service.js';
import { User } from '../../models/user.js';
import { LoginService } from '../../services/login.service.js';
import Swal from 'sweetalert2';

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

  // Se elimina la fecha de reserva del formulario (la pone el backend)

  /* Usuario logueado */
  user?: User | null;

  /* ---- Crear publicacion ---- */
  crearVisible = false;
  crearForm!: FormGroup;

  /* Mapeo de servicios con emojis */
  private servicioMap: Record<string, string> = {
    limpieza: '🧹',
    plomeria: '🔧',
    electricidad: '⚡',
    jardineria: '🌱',
    pintura: '🎨',
    carpinteria: '🔨',
    albañileria: '🧱',
    tecnologia: '💻',
    software: '💻',
    mecanica: '⚙️',
  };

  // Fallback nombres por ID para el selector de creación (coinciden con seed)
  private servicioIdNombreMap: Record<number, string> = {
    1: 'Limpieza',
    2: 'Plomería',
    3: 'Electricidad',
    4: 'Jardinería',
    5: 'Pintura',
    6: 'Carpintería',
    7: 'Albañilería',
    8: 'Tecnología',
  };



  constructor(
    private fb: FormBuilder,
    private publicacion: PublicacionService,
    private router: Router,
    private reserva: ReservaService,
    private auth: LoginService,

  ) { }


  ngOnInit(): void {
    this.auth.currentUserData.subscribe(user =>
      this.user = user);

    this.filtro = this.fb.group({
      from: [''],
      to: ['']
    });

    /*---- Form de reserva ----*/
    this.reservaForm = this.fb.group({
      notas: [''],
    });

    /*---- Form de creación de publicación ----*/
    this.crearForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
      precio: [null, [Validators.required, Validators.min(0)]],
      servicio_id: [null, Validators.required],
      estado: ['Activa'],
    });

    this.buscarPublicaciones();
  }

  abrirCrear(): void {
    this.crearVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cancelarCrear(): void {
    this.crearVisible = false;
  }

  guardarPublicacion(): void {
    if (this.crearForm.invalid) {
      this.crearForm.markAllAsTouched();
      return;
    }
    const v = this.crearForm.value;
    const body = {
      titulo: v.titulo?.toString().trim(),
      descripcion: v.descripcion?.toString().trim(),
      precio: Number(v.precio),
      servicio_id: Number(v.servicio_id),
      estado: v.estado || 'Activa',
    };
    console.log('BODY ENVIADO:', body);

    this.loading = true;

    this.publicacion.crearPublicacion(body).subscribe({
      next: () => {
        this.loading = false;

        this.crearVisible = false;
        document.body.style.overflow = '';

        this.crearForm.reset({
          titulo: '',
          descripcion: '',
          precio: null,
          servicio_id: null,
          estado: 'Activa',
        });

        this.buscarPublicaciones();

        Swal.fire({
          icon: 'success',
          title: 'Publicación creada con éxito',
          text: 'Tu publicación ha sido creada exitosamente.',
          timer: 2000,
          showConfirmButton: false,
          buttonsStyling: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button'
          },
          heightAuto: false,
          backdrop: true,
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la publicación',
          text: 'Ocurrió un error al crear la publicación. Intenta nuevamente más tarde.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button'
          },
          heightAuto: false,
        });
        console.error('Error al crear la publicación:', err);
      },
      complete: () => {
        (this.loading = false);
      }
    });
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

    const { from, to } = this.filtro.value as
      { from?: string; to?: string };
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
      const nombreServicio = (pub.servicio?.nombre || this.getNombreServicio(pub.servicio_id)).toLowerCase();
      return (
        titulo.includes(search) ||
        descripcion.includes(search) ||
        nombreServicio.includes(search)
      );
    });
  }

    /*---- Obtener nombre del servicio ----*/
  getNombreServicio(servicio_id: number): string {
    // Nombre poblado si existe alguna publicación con ese servicio
    const rel = this.publicaciones.find(p => p.servicio_id === servicio_id)?.servicio?.nombre;
    return rel || this.servicioIdNombreMap[servicio_id] || 'Servicio';
  }

  /*---- Obtener emoji del servicio (usa nombre si está disponible) ----*/
  getEmojiServicio(pub: Publicacion): string {
    const nombre = pub.servicio?.nombre || this.getNombreServicio(pub.servicio_id);
    const key = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    for (const k of Object.keys(this.servicioMap)) {
      if (key.includes(k)) {
        return this.servicioMap[k];
      }
    }
    return '🛠️';
  }



  /*---- Reserva ----*/
  abrirReserva(pub: Publicacion) {
    this.pubSeleccionada = pub;
    this.reservaForm.reset({
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
        Swal.fire({
          icon: 'success',
          title: 'Reserva creada con éxito',
          text: 'Su reserva ha sido registrada exitosamente.',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9fafb',
          color: '#1f2937',
        }).then(() => {
          this.cerrarReserva();
          this.router.navigate(['/main-page']);
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al crear la reserva',
          text: err.error?.message || 'Intente nuevamente más tarde.',
          confirmButtonColor: '#2563eb',
        });
      },
    });
  }
}

