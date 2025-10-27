import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart } from '../../features/cart/cart.js';
import { map } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <header class="topbar">
    <nav class="container">
      <a routerLink="/" class="brand">MyShop</a>
      <span class="spacer"></span>
      <a routerLink="/shop">Tienda</a>
      <a routerLink="/cart">Carrito ({{ (count$ | async) ?? 0}})</a>
      <a routerLink="/login" class="login">Ingresar</a>
    </nav>
  </header>
  `,
  styles: [`
    .topbar{position:sticky;top:0;background:rgba(13,17,23,.6);backdrop-filter:blur(10px);
      border-bottom:1px solid rgba(255,255,255,.08);}
    .container{max-width:1200px;margin:0 auto;padding:0 1rem;height:64px;display:flex;align-items:center;gap:1rem;}
    .brand{font-weight:800;text-decoration:none;color:#fff;}
    .spacer{flex:1}
    a{color:#cfd6e6;text-decoration:none}
    .login{margin-left:.5rem}
  `]
})
export class TopbarComponent {
  count$!: Observable<number>;
    constructor(private cart: Cart) {
    this.count$ = this.cart.items$.pipe(
      map(items => (items || []).reduce((sum, it) => sum + (it.qty ?? 0), 0))
    );
  }
}
