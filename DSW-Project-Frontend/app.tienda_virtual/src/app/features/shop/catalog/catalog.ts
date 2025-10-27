import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.js';
import { Product } from '../../../core/models.js';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../shared/ui/product-card/product-card.js';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Cart } from '../../cart/cart.js';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {
  products$!: Observable<Product[]>;
  q = '';
  constructor(
    private productsService: ProductsService,
    private cart: Cart
  ) {}
  
  ngOnInit(): void {
    this.products$ = this.productsService.list();
  }
  search() {
    this.products$ = this.productsService.list({ q: this.q });
  }
  addToCart(p: Product) {
    this.cart.add(p, 1);
  }

}
