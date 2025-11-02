import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../services/servicio.service.js';
import { CommonModule } from '@angular/common';
import { ServicioModel } from '../../models/servicio.model.js';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css'],
})
export class ServiciosComponent implements OnInit {

  servicios: ServicioModel[] = [];

  constructor(private servicio: ServicioService) {}

  ngOnInit(): void {
    this.servicio.ConsultarServicios().subscribe((response) => {
      this.servicios = response.data;
    });
  }
}
