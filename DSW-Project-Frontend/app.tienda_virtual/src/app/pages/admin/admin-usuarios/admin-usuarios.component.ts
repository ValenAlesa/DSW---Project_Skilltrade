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
  crearUsuarioForm!: FormGroup;
  loading = false;
  showModal = false;

  usuarios: User[] = []; 
  loadingLista = false;
  editarVisible = false;
  editarForm!: FormGroup;
  usuarioSeleccionado: User | null = null;

  constructor(private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.crearUsuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      domicilio: [''],
      rol: ['CLIENTE', Validators.required] // Ahora es un campo editable
    });


    this.editarForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      domicilio: [''],
      rol: ['', Validators.required] // Agregar rol al formulario de edición
    });

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loadingLista = true;
    
    // Obtener el ID del usuario actual desde localStorage
    const currentUserJson = localStorage.getItem('currentUser');
    const currentUserId = currentUserJson ? JSON.parse(currentUserJson).id : null;
    
    this.adminService.getUsuarios().subscribe({
      next: (users: User[]) => {
        this.usuarios = (users || []).filter(user => user.id !== currentUserId);
        this.loadingLista = false;
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err);
        this.loadingLista = false;
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar la lista de usuarios.',
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
    this.crearUsuarioForm.reset({ rol: 'CLIENTE' });
  }

  crearUsuario(): void {
    if (this.crearUsuarioForm.invalid) return;

    this.loading = true;
    const userData = this.crearUsuarioForm.value;

    this.adminService.crearUsuario(userData).subscribe({
      next: (response: any) => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario creado correctamente',
          icon: 'success',
          confirmButtonColor: '#6366f1'
        });
        this.cerrarModal();
        this.cargarUsuarios(); 
      },
      error: (error: any) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo crear el usuario',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  abrirEditar(usuario: User): void {
    this.usuarioSeleccionado = usuario;
    this.editarForm.patchValue({
      username: usuario.username,
      email: usuario.email,
      telefono: usuario.telefono || '',
      domicilio: usuario.domicilio || '',
      rol: usuario.rol || 'CLIENTE'
    });
    this.editarVisible = true;
  }

  guardarEdicion(): void {
    if (this.editarForm.invalid || !this.usuarioSeleccionado) return;

    this.loading = true;
    const datos = this.editarForm.value;

    this.adminService.updateUsuario(this.usuarioSeleccionado.id, datos).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#6366f1'
        });
        this.cancelarEditar();
        this.cargarUsuarios();
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
    this.usuarioSeleccionado = null;
    this.editarForm.reset();
  }

  eliminarUsuario(usuario: User): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al usuario ${usuario.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El usuario ha sido eliminado',
              icon: 'success',
              confirmButtonColor: '#6366f1'
            });
            this.cargarUsuarios();
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

  get username() { return this.crearUsuarioForm.get('username'); }
  get email() { return this.crearUsuarioForm.get('email'); }
  get password() { return this.crearUsuarioForm.get('password'); }
  
  get editUsername() { return this.editarForm.get('username'); }
  get editEmail() { return this.editarForm.get('email'); }
}