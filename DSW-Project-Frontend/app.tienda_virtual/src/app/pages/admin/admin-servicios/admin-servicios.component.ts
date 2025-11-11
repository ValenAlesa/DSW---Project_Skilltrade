import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";



@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-servicios.component.html',
  styleUrls: ['./admin-servicios.component.css'],


})
export class AdminServiciosComponent implements OnInit{
  crearServicioForm!: FormGroup;
  showModal = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearServicioForm = this.fb.group({
      nombre: [''],
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
    this.crearServicioForm.reset();
  }

  crearServicio(): void {
    if (this.crearServicioForm.invalid) {
      Object.keys(this.crearServicioForm.controls).forEach(key => {
        this.crearServicioForm.get(key)?.markAsTouched();
      });

      return;
    }

    this.loading = true;
    const servicioData = this.crearServicioForm.value;

    setTimeout(() => {
      this.loading = false;
      Swal.fire({
        title: '¡Éxito!',
        text: 'Servicio creado correctamente',
        icon: 'success',
        confirmButtonColor: '#6366f1'
      });
      this.cerrarModal();
    }, 1000);
  }

    get nombre() { return this.crearServicioForm.get('nombre'); }
   
  }