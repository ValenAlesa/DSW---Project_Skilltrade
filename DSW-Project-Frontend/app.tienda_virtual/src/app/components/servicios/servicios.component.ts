import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../services/servicio.service.js';
import { CommonModule } from '@angular/common';
import { ServicioModel } from '../../models/servicio.model.js';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios implements OnInit {

  datos: ServicioModel[] = [];

  constructor(private servicio: Servicio) {}

  ngOnInit(): void {
    this.servicio.ConsultarServicios().subscribe((response) => {
      this.datos = response.data;
    });
  }
}
