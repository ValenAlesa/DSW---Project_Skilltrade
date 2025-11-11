import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AdminServiciosService, Servicio } from "../../../services/admin-servicios.service";

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-servicios.component.html',
  styleUrls: ['./admin-servicios.component.css'],
})
export class AdminServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  servicioSeleccionado: Servicio | null = null;
  crearVisible = false;
  editarVisible = false;
  cargando = false;

  crearServicioForm: FormGroup;
  editarForm: FormGroup;

  constructor(
    private adminServiciosService: AdminServiciosService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.crearServicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.editarForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  volver(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  cargarServicios() {
    this.cargando = true;
    this.adminServiciosService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
        this.cargando = false;
      }
    });
  }

  abrirCrear() {
    this.crearVisible = true;
    this.crearServicioForm.reset();
  }

  cerrarCrear() {
    this.crearVisible = false;
    this.crearServicioForm.reset();
  }

  crearServicio() {
    if (this.crearServicioForm.invalid) {
      Object.keys(this.crearServicioForm.controls).forEach(key => {
        this.crearServicioForm.get(key)?.markAsTouched();
      });
      return;
    }

    const servicioData: Servicio = {
      nombre: this.crearServicioForm.value.nombre
    };

    this.adminServiciosService.crearServicio(servicioData).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Servicio creado correctamente', 'success');
        this.cerrarCrear();
        this.cargarServicios();
      },
      error: (error) => {
        console.error('Error al crear servicio:', error);
        Swal.fire('Error', 'No se pudo crear el servicio', 'error');
      }
    });
  }

  abrirEditar(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
    this.editarForm.patchValue({
      nombre: servicio.nombre
    });
    this.editarVisible = true;
  }

  cancelarEditar() {
    this.editarVisible = false;
    this.servicioSeleccionado = null;
    this.editarForm.reset();
  }

  guardarEdicion() {
    if (this.editarForm.invalid || !this.servicioSeleccionado?.id) {
      Object.keys(this.editarForm.controls).forEach(key => {
        this.editarForm.get(key)?.markAsTouched();
      });
      return;
    }

    const datosActualizados = {
      nombre: this.editarForm.value.nombre
    };

    this.adminServiciosService.updateServicio(this.servicioSeleccionado.id, datosActualizados).subscribe({
      next: () => {
        Swal.fire('¡Éxito!', 'Servicio actualizado correctamente', 'success');
        this.cancelarEditar();
        this.cargarServicios();
      },
      error: (error) => {
        console.error('Error al actualizar servicio:', error);
        Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
      }
    });
  }

  eliminarServicio(servicio: Servicio) {
    if (!servicio.id) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el servicio "${servicio.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && servicio.id) {
        this.adminServiciosService.deleteServicio(servicio.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado', 'success');
            this.cargarServicios();
          },
          error: (error) => {
            console.error('Error al eliminar servicio:', error);
            Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
          }
        });
      }
    });
  }
}
