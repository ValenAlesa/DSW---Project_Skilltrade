import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicacionService } from '../../services/publicacion.service.js';
import { Publicacion } from '../../models/publicacion.model.js';
import { LoginService } from '../../services/login.service.js';
import { User } from '../../models/user.js';
import Swal from 'sweetalert2';
import { AdminServiciosService, Servicio } from '../../services/admin-servicios.service.js';

@Component({
  selector: 'app-mis-publicaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.css'],
})
export class MisPublicacionesComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  loading = false;
  errorMsg = '';
  user?: User | null;

  /* Modal de edición */
  editarVisible = false;
  editarForm!: FormGroup;
  publicacionEditando?: Publicacion;

  /* Lista de servicios disponibles */
  servicios: Servicio[] = [];

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
    ingles: '📚',
    clase: '📚',
  };

  constructor(
    private fb: FormBuilder,
    private publicacionService: PublicacionService,
    private auth: LoginService,
    private router: Router,
    private adminServiciosService: AdminServiciosService
  ) {}

  ngOnInit(): void {
    this.auth.currentUserData.subscribe(user => {
      this.user = user;
    });

    // Cargar servicios disponibles
    this.cargarServicios();

    this.editarForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
      precio: [null, [Validators.required, Validators.min(0)]],
      servicio_id: [null, Validators.required],
      estado: ['Activa'],
    });

    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones(): void {
    if (!this.user?.id) {
      this.errorMsg = 'Usuario no autenticado';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // Cargar todas las publicaciones y filtrar en el cliente
    this.publicacionService.getPublicaciones(null, null).subscribe({
      next: (data: Publicacion[]) => {
        console.log('[MisPublicaciones] Todas las publicaciones:', data);
        console.log('[MisPublicaciones] Usuario actual ID:', this.user?.id);
        
        // Filtrar solo las publicaciones del usuario actual
        this.publicaciones = data.filter(pub => {
          const ownerId = pub.usuario?.id ?? pub.usuario_id;
          console.log(`[MisPublicaciones] Publicación "${pub.titulo}": usuario_id=${pub.usuario_id}, usuario.id=${pub.usuario?.id}, ownerId=${ownerId}`);
          return Number(ownerId) === Number(this.user!.id);
        });
        
        console.log('[MisPublicaciones] Publicaciones filtradas:', this.publicaciones);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar tus publicaciones.';
        this.publicaciones = [];
        this.loading = false;
      },
    });
  }

  cargarServicios(): void {
    this.adminServiciosService.getServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
      }
    });
  }

  getNombreServicio(servicio_id: number): string {
    const rel = this.publicaciones.find(p => p.servicio_id === servicio_id)?.servicio?.nombre;
    if (rel) return rel;
    
    // Buscar en la lista de servicios cargados
    const servicio = this.servicios.find(s => s.id === servicio_id);
    return servicio?.nombre || 'Servicio';
  }

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

  abrirEditar(pub: Publicacion): void {
    this.publicacionEditando = pub;
    this.editarForm.patchValue({
      titulo: pub.titulo,
      descripcion: pub.descripcion,
      precio: pub.precio,
      servicio_id: pub.servicio_id,
      estado: pub.estado || 'Activa',
    });
    this.editarVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cancelarEditar(): void {
    this.editarVisible = false;
    this.publicacionEditando = undefined;
    this.editarForm.reset();
    document.body.style.overflow = '';
  }

  guardarEdicion(): void {
    if (this.editarForm.invalid || !this.publicacionEditando?.id) {
      this.editarForm.markAllAsTouched();
      return;
    }

    const v = this.editarForm.value;
    const body = {
      titulo: v.titulo?.toString().trim(),
      descripcion: v.descripcion?.toString().trim(),
      precio: Number(v.precio),
      servicio_id: Number(v.servicio_id),
      estado: v.estado || 'Activa',
    };

    this.loading = true;

    this.publicacionService.actualizarPublicacion(this.publicacionEditando.id, body).subscribe({
      next: () => {
        this.loading = false;
        this.editarVisible = false;
        document.body.style.overflow = '';
        this.publicacionEditando = undefined;
        this.editarForm.reset();

        Swal.fire({
          icon: 'success',
          title: 'Publicación actualizada',
          text: 'Tu publicación ha sido actualizada exitosamente.',
          timer: 2000,
          showConfirmButton: false,
          buttonsStyling: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
          },
          heightAuto: false,
        });

        this.cargarMisPublicaciones();
      },
      error: (err: any) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un error al actualizar la publicación. Intenta nuevamente más tarde.',
          confirmButtonText: 'Aceptar',
          buttonsStyling: false,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-text',
            confirmButton: 'custom-swal-button',
          },
          heightAuto: false,
        });
        console.error('Error al actualizar publicación:', err);
      },
    });
  }

  eliminarPublicacion(pub: Publicacion): void {
    if (!pub.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puede eliminar una publicación sin ID',
        confirmButtonText: 'Aceptar',
        buttonsStyling: false,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-text',
          confirmButton: 'custom-swal-button',
        },
        heightAuto: false,
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer. ¿Deseas eliminar esta publicación?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        htmlContainer: 'custom-swal-text',
        confirmButton: 'custom-swal-button-delete',
        cancelButton: 'custom-swal-button-cancel',
      },
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed && pub.id) {
        this.loading = true;
        this.publicacionService.eliminarPublicacion(pub.id).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Publicación eliminada',
              text: 'Tu publicación ha sido eliminada exitosamente.',
              timer: 2000,
              showConfirmButton: false,
              buttonsStyling: false,
              customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-text',
              },
              heightAuto: false,
            });
            this.cargarMisPublicaciones();
          },
          error: (err: any) => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'Ocurrió un error al eliminar la publicación. Intenta nuevamente más tarde.',
              confirmButtonText: 'Aceptar',
              buttonsStyling: false,
              customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                htmlContainer: 'custom-swal-text',
                confirmButton: 'custom-swal-button',
              },
              heightAuto: false,
            });
            console.error('Error al eliminar publicación:', err);
          },
        });
      }
    });
  }

  volverADashboard(): void {
    this.router.navigate(['/main-page']);
  }
}
