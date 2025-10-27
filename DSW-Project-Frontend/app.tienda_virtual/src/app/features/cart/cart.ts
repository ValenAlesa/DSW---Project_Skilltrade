import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../../core/models';

const KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class Cart {
  private _items$ = new BehaviorSubject<CartItem[]>(this.restore());
  items$ = this._items$.asObservable();

  add(product: Product, qty = 1) {
    const items = [...this._items$.value];
    const i = items.findIndex(it => it.product.id === product.id);
    if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
    else items.push({ product, qty });
    this.persist(items);
  }
  remove(productId: number) {
    this.persist(this._items$.value.filter(it => it.product.id !== productId));
  }
  setQty(productId: number, qty: number) {
    this.persist(this._items$.value.map(it => it.product.id === productId ? { ...it, qty } : it));
  }
  clear() { this.persist([]); }

  get total() {
    return this._items$.value.reduce((acc, it) => acc + it.product.price * it.qty, 0);
  }

  private persist(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); this._items$.next(items); }
  private restore(): CartItem[] { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; }
}
