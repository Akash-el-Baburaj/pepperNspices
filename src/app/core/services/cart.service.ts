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

  // Computed state
  readonly cartCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  readonly cartSubtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  readonly cartTax = computed(() => {
    return this.cartSubtotal() * 0.08; // 8% mock tax
  });

  readonly cartShipping = computed(() => {
    const subtotal = this.cartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
  });

  readonly cartTotal = computed(() => {
    return this.cartSubtotal() + this.cartTax() + this.cartShipping();
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

  clearCart() {
    this.cartItems.set([]);
  }
}
