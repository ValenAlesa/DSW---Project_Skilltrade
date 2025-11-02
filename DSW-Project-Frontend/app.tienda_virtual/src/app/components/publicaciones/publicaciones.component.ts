import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../services/publicacion.service.js';
import { Publicacion } from '../../models/publicacion.model.js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicaciones.html',
  styleUrls: ['./publicaciones.css'],
})
export class PublicacionesComponent implements OnInit {

  publicaciones: Publicacion[] = [];
  loading = false;
  errorMsg = '';
  filtro!: FormGroup;



  constructor(private fb: FormBuilder, private publicacion: PublicacionService) {}

  

  ngOnInit(): void {
    this.filtro = this.fb.group({
      from: [''],
      to: ['']
    });
    this.buscarPublicaciones();
  }

  buscarPublicaciones(): void {
    this.loading = true;
    this.errorMsg = '';

    this.publicacion.getPublicaciones({ from: this.filtro.value.from, to: this.filtro.value.to }).subscribe({
      next: (data) => {
        this.publicaciones = data as Publicacion[];
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar las publicaciones.';
        this.publicaciones = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filtrarPublicaciones(): void {
    const { from, to } = this.filtro.value || {};
    this.loading = true;
    this.errorMsg = '';

    this.publicacion.getPublicaciones({ from, to }).subscribe({
      next: (data) => {
        this.publicaciones = data as Publicacion[];
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al cargar las publicaciones.';
        this.publicaciones = [];
      },
      complete: () => {
        this.loading = false;
      }
        
    });
  }

  limpiar(): void {
    this.filtro.reset();
    this.buscarPublicaciones();
  }

}
