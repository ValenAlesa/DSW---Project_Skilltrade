import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchQuery: string = '';
  cartCount: number = 0;
  userMenuOpen: boolean = false;
  notificationsOpen: boolean = false;

  onSearch(): void {
    console.log('Buscando:', this.searchQuery);
    // Aquí irá la lógica de búsqueda
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.notificationsOpen = false;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.userMenuOpen = false;
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // Aquí irá la lógica de logout
  }
}
