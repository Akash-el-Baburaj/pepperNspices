import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../mock-data/data';
import { ActivityTrackingService } from './activity-tracking.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly activityService = inject(ActivityTrackingService);

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
    this.activityService.track('ADD_TO_CART', `Added ${product.name} x${quantity} to crate`, { productId: product.id, quantity });
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
    this.activityService.track('UPDATE_QTY', `Updated quantity of ${item.product.name} to x${quantity}`, { productId, quantity });
  }

  removeFromCart(productId: string) {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item) return;

    this.cartItems.update(items =>
      items.filter(i => i.product.id !== productId)
    );
    this.activityService.track('REMOVE_FROM_CART', `Removed ${item.product.name} from crate`, { productId });
  }

  applyPromo(code: string): boolean {
    if (code.trim().toUpperCase() === 'AKZ25') {
      this.appliedPromo.set('AKZ25');
      this.activityService.track('APPLY_PROMO', `Applied discount code: ${code.trim().toUpperCase()}`, { code: code.trim().toUpperCase() });
      return true;
    }
    this.activityService.track('APPLY_PROMO_FAILED', `Failed to apply discount code: ${code}`, { code });
    return false;
  }

  removePromo() {
    const code = this.appliedPromo();
    this.appliedPromo.set(null);
    this.activityService.track('REMOVE_PROMO', `Removed discount code: ${code}`, { code });
  }

  clearCart() {
    this.cartItems.set([]);
    this.appliedPromo.set(null);
    this.activityService.track('CLEAR_CART', 'Cleared all items from crate');
  }
}
