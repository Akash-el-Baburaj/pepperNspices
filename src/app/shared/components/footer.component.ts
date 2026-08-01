import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-peppercorn-950 text-gray-300 pt-16 pb-8 border-t border-cinnamon-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <!-- Column 1: Brand & Bio -->
          <div class="space-y-4">
            <a routerLink="/" class="flex items-center gap-2 group">
              <span class="w-8 h-8 rounded-lg bg-chili-600 flex items-center justify-center">
                <svg class="w-4 h-4 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.4 2.3c-.2-.2-.5-.3-.8-.3-.3 0-.6.1-.8.3L3 10.1C1.8 11.3 1.1 13 1.1 14.8c0 3.7 3 6.7 6.7 6.7.7 0 1.4-.1 2-.4.4-.2.5-.7.3-1.1-.2-.4-.7-.5-1.1-.3-.4.2-.9.3-1.3.3-2.9 0-5.2-2.3-5.2-5.2 0-1.4.6-2.8 1.6-3.7l6.8-6.8c.2-.2.5-.2.7 0l6.8 6.8c1 1 1.6 2.3 1.6 3.7 0 2.9-2.3 5.2-5.2 5.2-.4 0-.9-.1-1.3-.3-.4-.2-.9-.1-1.1.3-.2.4-.1.9.3 1.1.7.3 1.3.4 2 .4 3.7 0 6.7-3 6.7-6.7 0-1.8-.7-3.5-1.9-4.7l-7.8-7.8z"/>
                </svg>
              </span>
              <span class="text-lg font-extrabold tracking-tight text-white">HALDI & HORN</span>
            </a>
            <p class="text-xs text-gray-400 leading-relaxed pt-2">
              Sourcing the world's most exceptional single-origin spices, hand-harvested and stone-ground to unlock flavors that tell the story of their lands.
            </p>
            <div class="flex items-center gap-3 pt-3">
              <!-- Social Icons -->
              <a href="#" class="p-2 bg-white/5 hover:bg-chili-600 hover:text-white rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="p-2 bg-white/5 hover:bg-chili-600 hover:text-white rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.31 0C5.52 0 0 5.52 0 12.31c0 5.43 3.52 10.04 8.41 11.67.62.11.84-.27.84-.59 0-.29-.01-1.07-.01-2.1-3.42.74-4.14-1.65-4.14-1.65-.56-1.42-1.37-1.8-1.37-1.8-1.12-.76.08-.75.08-.75 1.24.09 1.89 1.27 1.89 1.27 1.1 1.88 2.88 1.34 3.58 1.02.11-.8.43-1.34.78-1.65-2.73-.31-5.6-1.37-5.6-6.08 0-1.34.48-2.44 1.27-3.3-.13-.31-.55-1.56.12-3.26 0 0 1.03-.33 3.38 1.26a11.75 11.75 0 016.16 0c2.35-1.59 3.38-1.26 3.38-1.26.67 1.7.25 2.95.12 3.26.79.86 1.27 1.96 1.27 3.3 0 4.72-2.88 5.76-5.62 6.07.44.38.83 1.13.83 2.28 0 1.65-.01 2.97-.01 3.38 0 .33.22.71.85.59C20.48 22.34 24 17.74 24 12.31 24 5.52 18.48 0 12.31 0z"/></svg>
              </a>
              <a href="#" class="p-2 bg-white/5 hover:bg-chili-600 hover:text-white rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Categories -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Spice Collections</h3>
            <ul class="space-y-2 text-xs text-gray-400">
              <li><a routerLink="/shop" [queryParams]="{category: 'peppercorns'}" class="hover:text-saffron-400 transition-colors duration-200">Rare Peppercorns</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'ground-spices'}" class="hover:text-saffron-400 transition-colors duration-200">Stone-Ground Spices</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'blends'}" class="hover:text-saffron-400 transition-colors duration-200">Signature Spice Blends</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'whole-spices'}" class="hover:text-saffron-400 transition-colors duration-200">Whole Spices & Herbs</a></li>
              <li><a routerLink="/shop" [queryParams]="{category: 'gift-boxes'}" class="hover:text-saffron-400 transition-colors duration-200">Artisanal Gift Chests</a></li>
            </ul>
          </div>

          <!-- Column 3: Quick Links -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Our House</h3>
            <ul class="space-y-2 text-xs text-gray-400">
              <li><a routerLink="/about" class="hover:text-saffron-400 transition-colors duration-200">Our Sourcing Map</a></li>
              <li><a routerLink="/about" class="hover:text-saffron-400 transition-colors duration-200">The Farm-To-Table Path</a></li>
              <li><a href="#" class="hover:text-saffron-400 transition-colors duration-200">Wholesale Accounts</a></li>
              <li><a href="#" class="hover:text-saffron-400 transition-colors duration-200">Shipping & Returns</a></li>
              <li><a href="#" class="hover:text-saffron-400 transition-colors duration-200">Contact Merchant</a></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Join the Circle</h3>
            <p class="text-xs text-gray-400 leading-relaxed">
              Subscribe to receive spice harvest alerts, exclusive seasonal recipes, and stories from the farm origins.
            </p>
            
            @if (newsletterSubmitted()) {
              <div class="p-3 bg-cinnamon-900/40 rounded-xl border border-cinnamon-800 text-center text-xs text-saffron-400 font-bold animate-fade-in">
                ✓ Thank you for subscribing!
              </div>
            } @else {
              <form (submit)="onSubscribe($event)" class="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  required
                  class="flex-grow px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-chili-500 transition-colors duration-200"
                />
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-chili-600 hover:bg-chili-500 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Join
                </button>
              </form>
            }
          </div>

        </div>

        <!-- Divider -->
        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Haldi & Horn Spice Merchants. Crafted for culinary artisans.</p>
          <div class="flex items-center gap-6">
            <a href="#" class="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" class="hover:text-white transition-colors duration-200">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly newsletterSubmitted = signal(false);

  onSubscribe(event: Event) {
    event.preventDefault();
    this.newsletterSubmitted.set(true);
  }
}
