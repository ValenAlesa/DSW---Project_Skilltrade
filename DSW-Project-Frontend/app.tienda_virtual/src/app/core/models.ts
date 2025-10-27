export interface User { id: number; name: string; email: string; }
export interface LoginDTO { email: string; password: string; }
export interface LoginResponse { token: string; user: User; }

export interface Product { id: number; name: string; price: number; imageUrl?: string; }
export interface CartItem { product: Product; qty: number; }
