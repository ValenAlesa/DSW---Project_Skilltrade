import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../../services/login.service.js';
import { Observable } from 'rxjs';
import { RolService } from '../../services/rol.service.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  isAdmin$!: Observable<boolean>;
  isCliente$!: Observable<boolean>;

  auth = inject(LoginService)
  router = inject(Router)

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.isAdmin$ = this.rolService.esAdmin();
    this.isCliente$ = this.rolService.esCliente();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}