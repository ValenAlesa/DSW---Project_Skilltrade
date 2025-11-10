import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // Adjust the path as needed
import { FooterComponent } from './components/footer/footer.component'; // If you use <app-footer>
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class AppComponent {
  constructor(private router: Router) {}

  shouldShowLayout(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }
}