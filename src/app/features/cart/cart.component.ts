import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-10 text-center md:text-left">
          <span class="text-xs font-extrabold text-chili-600 uppercase tracking-widest block mb-1">Your Basket</span>
          <h1 class="text-4xl font-extrabold font-display text-peppercorn-950">Spice Selection</h1>
        </div>

        @if (cartItems().length === 0) {
          <!-- EMPTY CART VIEW -->
          <div class="text-center py-20 bg-white border border-cinnamon-100 rounded-3xl p-12 shadow-xs">
            <span class="text-6xl block">🧺</span>
            <h2 class="text-2xl font-bold font-display text-peppercorn-950 mt-6">Your Basket is Empty</h2>
            <p class="text-xs text-peppercorn-500 max-w-sm mx-auto mt-2 leading-relaxed font-medium">
              You haven't selected any of our single-origin harvests yet. Head over to our catalog to begin layering your culinary palette.
            </p>
            <a 
              routerLink="/shop" 
              class="inline-block mt-8 px-8 py-4 bg-chili-600 hover:bg-chili-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Browse Catalog
            </a>
          </div>
        } @else {
          <!-- CART ITEMS & SUMMARY GRID -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT PANEL: ITEMS LIST -->
            <div class="lg:col-span-8 space-y-4">
              @for (item of cartItems(); track item.product.id) {
                <div class="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white border border-cinnamon-100 shadow-xs relative">
                  
                  <!-- Thumbnail Image -->
                  <div class="w-24 h-24 bg-cinnamon-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-full h-full object-cover" />
                  </div>

                  <!-- Details -->
                  <div class="flex-grow text-center sm:text-left min-w-0">
                    <span class="text-[10px] font-extrabold text-saffron-600 uppercase tracking-widest block">{{ item.product.category.replace('-', ' ') }}</span>
                    <h3 [routerLink]="['/product', item.product.id]" class="text-lg font-bold text-peppercorn-900 leading-tight hover:text-chili-600 transition-colors cursor-pointer truncate mt-0.5">{{ item.product.name }}</h3>
                    <p class="text-[11px] text-peppercorn-400 font-semibold mt-1">Origin: {{ item.product.origin }}</p>
                    <div class="text-sm font-extrabold text-peppercorn-950 mt-2">{{ item.product.price | currency }}</div>
                  </div>

                  <!-- Quantity Incrementor -->
                  <div class="flex items-center justify-between border border-cinnamon-100 rounded-xl p-1 bg-cinnamon-50/50 w-28">
                    <button 
                      (click)="updateQty(item.product.id, item.quantity - 1)"
                      class="w-8 h-8 flex items-center justify-center font-bold text-peppercorn-600 hover:bg-white rounded-lg transition-all"
                    >
                      −
                    </button>
                    <span class="text-xs font-bold text-peppercorn-900 w-6 text-center select-none">{{ item.quantity }}</span>
                    <button 
                      (click)="updateQty(item.product.id, item.quantity + 1)"
                      [disabled]="item.quantity >= item.product.stock"
                      class="w-8 h-8 flex items-center justify-center font-bold text-peppercorn-600 disabled:opacity-30 hover:bg-white rounded-lg transition-all"
                    >
                      +
                    </button>
                  </div>

                  <!-- Total Price & Remove CTA -->
                  <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 border-cinnamon-50 pt-4 sm:pt-0">
                    <div class="text-right sm:block flex items-center gap-2">
                      <span class="text-[10px] text-peppercorn-400 font-bold block sm:hidden">Total:</span>
                      <span class="text-base font-extrabold text-peppercorn-950">{{ (item.product.price * item.quantity) | currency }}</span>
                    </div>
                    
                    <button 
                      (click)="removeItem(item.product.id)"
                      class="p-2 text-peppercorn-400 hover:text-chili-600 hover:bg-chili-50 rounded-lg transition-colors"
                      title="Remove spice"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                      </svg>
                    </button>
                  </div>

                </div>
              }
            </div>

            <!-- RIGHT PANEL: SUMMARY CARD -->
            <div class="lg:col-span-4 space-y-6">
              <div class="bg-white border border-cinnamon-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 class="text-sm font-extrabold uppercase tracking-widest text-peppercorn-900 border-b border-cinnamon-50 pb-3">Order Summary</h3>
                
                <div class="space-y-2.5 text-xs text-peppercorn-600 font-medium">
                  <div class="flex items-center justify-between">
                    <span>Subtotal</span>
                    @if (promoDiscount() > 0) {
                      <div class="space-x-1.5">
                        <span class="line-through text-peppercorn-400 font-medium">{{ subtotal() | currency }}</span>
                        <span class="font-bold text-peppercorn-900">{{ (subtotal() - promoDiscount()) | currency }}</span>
                      </div>
                    } @else {
                      <span class="font-bold text-peppercorn-900">{{ subtotal() | currency }}</span>
                    }
                  </div>

                  @if (promoDiscount() > 0) {
                    <div class="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Discount (25% off)</span>
                      <span class="font-bold">- {{ promoDiscount() | currency }}</span>
                    </div>
                  }

                  <div class="flex items-center justify-between">
                    <span>Est. Tax (8%)</span>
                    <span class="font-bold text-peppercorn-900">{{ tax() | currency }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Shipping</span>
                    @if (shipping() === 0) {
                      <span class="font-bold text-emerald-600">FREE</span>
                    } @else {
                      <span class="font-bold text-peppercorn-900">{{ shipping() | currency }}</span>
                    }
                  </div>
                  
                  @if (shipping() > 0) {
                    <div class="text-[10px] text-saffron-600 font-bold bg-saffron-50/50 p-2 border border-saffron-100 rounded-lg">
                      💡 Spend only {{ (50 - subtotal()) | currency }} more for FREE Shipping!
                    </div>
                  }
                </div>

                <!-- Promo Code Widget -->
                <div class="pt-4 border-t border-cinnamon-100 space-y-2">
                  <span class="text-[10px] font-extrabold uppercase tracking-widest text-peppercorn-400 block">Promo Code</span>
                  
                  @if (appliedPromo()) {
                    <div class="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs font-semibold text-emerald-800 animate-fade-in">
                      <div class="flex items-center gap-1.5">
                        <span class="text-emerald-500">✓</span>
                        <span>Code <strong class="font-bold font-mono">{{ appliedPromo() }}</strong> applied!</span>
                      </div>
                      <button 
                        (click)="removePromo()"
                        class="text-emerald-600 hover:text-emerald-800 font-extrabold px-1 rounded hover:bg-emerald-100/50 transition-colors"
                        title="Remove code"
                      >
                        ✕
                      </button>
                    </div>
                  } @else {
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        [(ngModel)]="promoInput" 
                        placeholder="Have a promo code?" 
                        class="w-full text-xs font-semibold px-3 py-2 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-moss-500 uppercase font-mono"
                        (keyup.enter)="applyPromo()"
                      />
                      <button 
                        (click)="applyPromo()"
                        class="px-4 py-2 bg-moss-700 hover:bg-moss-600 text-white text-xs font-extrabold rounded-xl transition-all hover:scale-102"
                      >
                        Apply
                      </button>
                    </div>
                    @if (promoError()) {
                      <p class="text-[10px] text-chili-600 font-semibold leading-none">{{ promoError() }}</p>
                    }
                  }
                </div>

                <div class="pt-4 border-t border-cinnamon-100 flex items-center justify-between">
                  <span class="text-sm font-extrabold text-peppercorn-950 uppercase tracking-wider">Total</span>
                  <span class="text-xl font-extrabold text-peppercorn-950">{{ total() | currency }}</span>
                </div>

                <a 
                  routerLink="/checkout"
                  class="block w-full text-center py-4 bg-chili-600 hover:bg-chili-500 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all hover:scale-103 active:scale-97"
                >
                  Proceed to Checkout
                </a>
              </div>

              <!-- Trust banner details -->
              <div class="p-4 rounded-2xl bg-cinnamon-100/50 border border-cinnamon-150 text-center text-[10px] text-peppercorn-500 font-bold leading-relaxed uppercase tracking-wider">
                🔒 Secured transaction by Sasya Botanical Vaults
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class CartComponent {
  private readonly cartService = inject(CartService);

  protected readonly cartItems = this.cartService.cartItems;
  protected readonly subtotal = this.cartService.cartSubtotal;
  protected readonly tax = this.cartService.cartTax;
  protected readonly shipping = this.cartService.cartShipping;
  protected readonly total = this.cartService.cartTotal;
  protected readonly appliedPromo = this.cartService.appliedPromo;
  protected readonly promoDiscount = this.cartService.promoDiscount;

  protected promoInput = '';
  protected promoError = signal<string | null>(null);

  updateQty(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  applyPromo() {
    this.promoError.set(null);
    if (!this.promoInput.trim()) {
      this.promoError.set('Please enter a promo code');
      return;
    }
    const success = this.cartService.applyPromo(this.promoInput);
    if (success) {
      this.promoInput = '';
      this.triggerConfetti();
    } else {
      this.promoError.set('Invalid or expired code');
    }
  }

  removePromo() {
    this.cartService.removePromo();
    this.promoError.set(null);
  }

  private triggerConfetti() {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
      
      import('canvas-confetti').then(module => {
        const confetti = module.default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7, x: 0.85 }, // localized for bottom-right summary section
          colors: ['#1e3f1e', '#adb8a6', '#fbbf24', '#e73624']
        });
      });
    }
  }
}
