import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component'; // Adjust the path as needed
import { FooterComponent } from './components/footer/footer.component'; // If you use <app-footer>
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class AppComponent {
  protected readonly title = signal('app.tienda_virtual');
}

