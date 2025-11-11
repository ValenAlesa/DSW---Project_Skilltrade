import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service.js";
import { AdminService } from "../../../services/admin.service.js";
import { User } from "../../../models/user.js";
import Swal from "sweetalert2";


@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
})
export class AdminUsuariosComponent implements OnInit {
  crearAdminForm!: FormGroup;
  loading = false;
  showModal = false;

  administradores: User[] = []; 
  loadingLista = false;
  editarVisible = false;
  editarForm!: FormGroup;
  adminSeleccionado: User | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.crearAdminForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      domicilio: [''],
      rol: ['ADMINISTRADOR'] 
    });


    this.editarForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      domicilio: [''],
    });

    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.loadingLista = true;
    
    // Obtener el ID del usuario actual desde localStorage
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUserId = currentUserJson ? JSON.parse(currentUserJson).id : null;
    
    this.adminService.getAdministradores().subscribe({
      next: (admins: User[]) => {
        this.administradores = (admins || []).filter(admin => admin.id !== currentUserId);
        this.loadingLista = false;
      },
      error: (err: any) => {
        console.error('Error al cargar administradores:', err);
        this.loadingLista = false;
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar la lista de administradores.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/dashboard']);
  }


  abrirModal(): void {
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.crearAdminForm.reset({ rol: 'ADMINISTRADOR' });
  }

  crearAdmin(): void {
    if (this.crearAdminForm.invalid) return;

    this.loading = true;
    const adminData = this.crearAdminForm.value;

    this.adminService.crearAdministrador(adminData).subscribe({
      next: (response: any) => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Administrador creado correctamente',
          icon: 'success',
          confirmButtonColor: '#6366f1'
        });
        this.cerrarModal();
        this.cargarAdministradores(); 
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo crear el administrador',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  abrirEditar(admin: User): void {
    this.adminSeleccionado = admin;
    this.editarForm.patchValue({
      username: admin.username,
      email: admin.email,
      telefono: admin.telefono || '',
      domicilio: admin.domicilio || ''
    });
    this.editarVisible = true;
  }

  guardarEdicion(): void {
    if (this.editarForm.invalid || !this.adminSeleccionado) return;

    this.loading = true;
    const datos = this.editarForm.value;

    this.adminService.updateAdministrador(this.adminSeleccionado.id, datos).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Administrador actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#6366f1'
        });
        this.cancelarEditar();
        this.cargarAdministradores();
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo actualizar',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  cancelarEditar(): void {
    this.editarVisible = false;
    this.adminSeleccionado = null;
    this.editarForm.reset();
  }

  eliminarAdministrador(admin: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al administrador ${admin.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAdministrador(admin.id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El administrador ha sido eliminado',
              icon: 'success',
              confirmButtonColor: '#6366f1'
            });
            this.cargarAdministradores();
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error',
              text: error.error?.message || 'No se pudo eliminar',
              icon: 'error',
              confirmButtonColor: '#ef4444'
            });
          }
        });
      }
    });
  }

  get username() { return this.crearAdminForm.get('username'); }
  get email() { return this.crearAdminForm.get('email'); }
  get password() { return this.crearAdminForm.get('password'); }
  
  get editUsername() { return this.editarForm.get('username'); }
  get editEmail() { return this.editarForm.get('email'); }
}