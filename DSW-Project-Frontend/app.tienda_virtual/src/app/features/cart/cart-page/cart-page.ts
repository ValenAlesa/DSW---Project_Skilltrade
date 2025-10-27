import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../cart.js';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage {
  get items$() { return this.cart.items$; }

  constructor(public cart: Cart) {}

  public Math = Math;

  checkout() {
    alert(`Total a pagar: ${this.cart.total}`);
    this.cart.clear();
  }

}
