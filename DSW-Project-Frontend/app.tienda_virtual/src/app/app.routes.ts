import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'shop', pathMatch: 'full' },

  { path: 'shop', loadComponent: () => 
    import ('./features/shop/catalog/catalog.js')
    .then(m => m.Catalog)
  },

  { path: 'product/:id', loadComponent: () => 
    import ('./features/shop/product-detail/product-detail.js')
    .then(m => m.ProductDetail)
  },

  { path: 'cart', loadComponent: () =>
      import('./features/cart/cart.js')
        .then(m => m.Cart) 
  },

  { path: 'login', loadComponent: () =>
      import('./features/auth/login/login.js')
        .then(m => m.Login) },

  { path: '**', redirectTo: 'shop' }
];
