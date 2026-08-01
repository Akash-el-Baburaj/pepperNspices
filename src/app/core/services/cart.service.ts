import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../mock-data/data';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal state
  readonly cartItems = signal<CartItem[]>([]);
  readonly appliedPromo = signal<string | null>(null);

  // Computed state
  readonly cartCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly cartSubtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  readonly promoDiscount = computed(() => {
    if (this.appliedPromo() === 'AKZ25') {
      return this.cartSubtotal() * 0.25; // 25% coupon code discount
    }
    return 0;
  });

  readonly cartTax = computed(() => {
    const taxableSubtotal = Math.max(0, this.cartSubtotal() - this.promoDiscount());
    return taxableSubtotal * 0.08; // 8% mock tax
  });

  readonly cartShipping = computed(() => {
    const subtotal = this.cartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
  });

  readonly cartTotal = computed(() => {
    const total = this.cartSubtotal() - this.promoDiscount() + this.cartTax() + this.cartShipping();
    return Math.max(0, total);
  });

  addToCart(product: Product, quantity = 1) {
    this.cartItems.update(items => {
      const existing = items.find(item => item.product.id === product.id);
      if (existing) {
        return items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { product, quantity }];
    });
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  applyPromo(code: string): boolean {
    if (code.trim().toUpperCase() === 'AKZ25') {
      this.appliedPromo.set('AKZ25');
      return true;
    }
    return false;
  }

  removePromo() {
    this.appliedPromo.set(null);
  }

  clearCart() {
    this.cartItems.set([]);
    this.appliedPromo.set(null);
  }
}
