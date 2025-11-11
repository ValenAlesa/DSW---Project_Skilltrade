import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service.js';


@Component ({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})


export class AdminDashboardComponent implements OnInit {
  adminName: string = '';
  
  
  
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginService.currentUserData.subscribe(user => {
      if (user) {
        this.adminName = user.username;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  navegarAUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  navegarAServicios(): void {
    this.router.navigate(['/admin/servicios']);
  }
}