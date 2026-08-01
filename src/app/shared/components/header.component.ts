import { Component, signal, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header 
      [class.py-3]="isScrolled()" 
      [class.py-5]="!isScrolled()"
      [class.bg-peppercorn-950/95]="isScrolled()" 
      [class.backdrop-blur-md]="isScrolled()"
      [class.shadow-md]="isScrolled()"
      [class.bg-transparent]="!isScrolled()"
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="flex items-center gap-2 group">
              <!-- Saffron styled spice drop container -->
              <span class="w-9 h-9 rounded-xl bg-chili-600 flex items-center justify-center shadow-lg group-hover:bg-saffron-500 transition-colors duration-300">
                <svg class="w-5 h-5 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.4 2.3c-.2-.2-.5-.3-.8-.3-.3 0-.6.1-.8.3L3 10.1C1.8 11.3 1.1 13 1.1 14.8c0 3.7 3 6.7 6.7 6.7.7 0 1.4-.1 2-.4.4-.2.5-.7.3-1.1-.2-.4-.7-.5-1.1-.3-.4.2-.9.3-1.3.3-2.9 0-5.2-2.3-5.2-5.2 0-1.4.6-2.8 1.6-3.7l6.8-6.8c.2-.2.5-.2.7 0l6.8 6.8c1 1 1.6 2.3 1.6 3.7 0 2.9-2.3 5.2-5.2 5.2-.4 0-.9-.1-1.3-.3-.4-.2-.9-.1-1.1.3-.2.4-.1.9.3 1.1.7.3 1.3.4 2 .4 3.7 0 6.7-3 6.7-6.7 0-1.8-.7-3.5-1.9-4.7l-7.8-7.8z"/>
                </svg>
              </span>
              <div class="flex flex-col">
                <span class="text-xl font-extrabold tracking-tight text-white leading-none">HALDI & HORN</span>
                <span class="text-[9px] font-bold text-saffron-400 tracking-widest uppercase">Spice Merchants</span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="text-saffron-400" [routerLinkActiveOptions]="{exact: true}" class="text-sm font-bold text-gray-200 hover:text-saffron-400 transition-colors duration-200">Home</a>
            
            <!-- Category Mega Dropdown -->
            <div class="relative group py-2">
              <a routerLink="/shop" routerLinkActive="text-saffron-400" class="flex items-center gap-1 text-sm font-bold text-gray-200 hover:text-saffron-400 transition-colors duration-200 cursor-pointer">
                <span>Shop Spices</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
                </svg>
              </a>
              
              <!-- Dropdown Panel -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-72 bg-peppercorn-900 border border-cinnamon-850 rounded-2xl shadow-xl p-4 transition-all duration-300">
                <div class="grid gap-2">
                  <a routerLink="/shop" [queryParams]="{category: 'peppercorns'}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-cinnamon-900/60 transition-colors duration-200">
                    <span class="text-lg">⚫</span>
                    <div>
                      <h4 class="text-xs font-bold text-white">Rare Peppercorns</h4>
                      <p class="text-[10px] text-gray-400">Smoked, crushed & whole estate pepper</p>
                    </div>
                  </a>
                  <a routerLink="/shop" [queryParams]="{category: 'ground-spices'}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-cinnamon-900/60 transition-colors duration-200">
                    <span class="text-lg">🌾</span>
                    <div>
                      <h4 class="text-xs font-bold text-white">Ground Spices</h4>
                      <p class="text-[10px] text-gray-400">batch-ground single-origin powders</p>
                    </div>
                  </a>
                  <a routerLink="/shop" [queryParams]="{category: 'blends'}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-cinnamon-900/60 transition-colors duration-200">
                    <span class="text-lg">🔥</span>
                    <div>
                      <h4 class="text-xs font-bold text-white">Spice Blends</h4>
                      <p class="text-[10px] text-gray-400">Authentic blends from around the world</p>
                    </div>
                  </a>
                  <a routerLink="/shop" [queryParams]="{category: 'whole-spices'}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-cinnamon-900/60 transition-colors duration-200">
                    <span class="text-lg">🪵</span>
                    <div>
                      <h4 class="text-xs font-bold text-white">Whole Spices</h4>
                      <p class="text-[10px] text-gray-400">Raw pods, seeds, and flower buds</p>
                    </div>
                  </a>
                  <a routerLink="/shop" [queryParams]="{category: 'gift-boxes'}" class="flex items-center gap-3 p-2 rounded-xl hover:bg-cinnamon-900/60 transition-colors duration-200">
                    <span class="text-lg">🎁</span>
                    <div>
                      <h4 class="text-xs font-bold text-white">Gift Boxes</h4>
                      <p class="text-[10px] text-gray-400">Curated cooking kits & tasting sets</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <a routerLink="/about" routerLinkActive="text-saffron-400" class="text-sm font-bold text-gray-200 hover:text-saffron-400 transition-colors duration-200">Our Story</a>
          </nav>

          <!-- Utilities (Search / Cart / Mobile Trigger) -->
          <div class="flex items-center gap-4">
            <!-- Mini Cart Trigger -->
            <div class="relative group">
              <button 
                routerLink="/cart"
                class="relative p-2 text-gray-300 hover:text-saffron-400 transition-colors duration-200 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                </svg>
                
                @if (cartCount() > 0) {
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-chili-600 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full animate-bounce shadow-md border border-peppercorn-900">
                    {{ cartCount() }}
                  </span>
                }
              </button>

              <!-- Hover Cart Preview Dropdown -->
              <div class="absolute right-0 top-full hidden group-hover:block w-80 bg-peppercorn-900 border border-cinnamon-850 rounded-2xl shadow-xl p-4 z-50">
                <h3 class="text-xs font-bold uppercase tracking-wider text-saffron-400 mb-3">Shopping Cart</h3>
                
                @if (cartItems().length === 0) {
                  <div class="text-center py-6">
                    <p class="text-xs text-gray-400">Your cart is empty.</p>
                    <a routerLink="/shop" class="text-xs font-bold text-chili-400 hover:text-chili-300 block mt-2 underline">Browse our spices</a>
                  </div>
                } @else {
                  <div class="max-h-56 overflow-y-auto mb-4 scrollbar-thin">
                    @for (item of cartItems(); track item.product.id) {
                      <div class="flex items-center gap-3 py-2 border-b border-cinnamon-950/50">
                        <img [src]="item.product.images[0]" [alt]="item.product.name" class="w-10 h-10 object-cover rounded-lg bg-cinnamon-950/20" />
                        <div class="flex-grow min-w-0">
                          <h4 class="text-xs font-bold text-white truncate">{{ item.product.name }}</h4>
                          <p class="text-[10px] text-gray-400">{{ item.quantity }} x {{ item.product.price | currency }}</p>
                        </div>
                        <button (click)="removeItem(item.product.id)" class="text-gray-500 hover:text-chili-400 p-1">
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>

                  <div class="pt-3 border-t border-cinnamon-800">
                    <div class="flex items-center justify-between mb-3">
                      <span class="text-xs text-gray-400 font-bold">Subtotal:</span>
                      <span class="text-sm font-extrabold text-white">{{ cartSubtotal() | currency }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <a routerLink="/cart" class="text-center text-xs font-bold py-2 rounded-xl text-white bg-cinnamon-800 hover:bg-cinnamon-700 transition-colors duration-200">View Cart</a>
                      <a routerLink="/checkout" class="text-center text-xs font-bold py-2 rounded-xl text-white bg-chili-600 hover:bg-chili-500 transition-colors duration-200">Checkout</a>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Mobile Hamburger Menu Button -->
            <button 
              (click)="toggleMobileMenu()" 
              class="md:hidden p-2 text-gray-300 hover:text-white flex items-center justify-center bg-white/5 rounded-full"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                @if (isMobileMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden bg-peppercorn-950 border-t border-white/5 px-4 pt-4 pb-6 space-y-3 shadow-xl">
          <a routerLink="/" (click)="closeMobileMenu()" class="block text-sm font-bold text-gray-200 hover:text-saffron-400 py-2 border-b border-white/5">Home</a>
          
          <div>
            <span class="block text-xs font-extrabold text-saffron-400 uppercase tracking-widest py-2">Categories</span>
            <div class="grid grid-cols-2 gap-2 pl-3 pt-1">
              <a routerLink="/shop" [queryParams]="{category: 'peppercorns'}" (click)="closeMobileMenu()" class="text-xs font-medium text-gray-300 hover:text-white py-1">⚫ Peppercorns</a>
              <a routerLink="/shop" [queryParams]="{category: 'ground-spices'}" (click)="closeMobileMenu()" class="text-xs font-medium text-gray-300 hover:text-white py-1">🌾 Ground Spices</a>
              <a routerLink="/shop" [queryParams]="{category: 'blends'}" (click)="closeMobileMenu()" class="text-xs font-medium text-gray-300 hover:text-white py-1">🔥 Spice Blends</a>
              <a routerLink="/shop" [queryParams]="{category: 'whole-spices'}" (click)="closeMobileMenu()" class="text-xs font-medium text-gray-300 hover:text-white py-1">🪵 Whole Spices</a>
              <a routerLink="/shop" [queryParams]="{category: 'gift-boxes'}" (click)="closeMobileMenu()" class="text-xs font-medium text-gray-300 hover:text-white py-1">🎁 Gift Boxes</a>
            </div>
          </div>
          
          <a routerLink="/shop" (click)="closeMobileMenu()" class="block text-sm font-bold text-gray-200 hover:text-saffron-400 py-2 border-b border-white/5">All Spices</a>
          <a routerLink="/about" (click)="closeMobileMenu()" class="block text-sm font-bold text-gray-200 hover:text-saffron-400 py-2">Our Story</a>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);

  protected readonly isScrolled = signal(false);
  protected readonly isMobileMenuOpen = signal(false);

  protected readonly cartItems = this.cartService.cartItems;
  protected readonly cartCount = this.cartService.cartCount;
  protected readonly cartSubtotal = this.cartService.cartSubtotal;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 30);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }
}
