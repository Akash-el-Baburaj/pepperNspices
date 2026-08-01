import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/mock-data/data';
import { CartService } from '../../core/services/cart.service';
import { RatingComponent } from './rating.component';
import { HeatLevelComponent } from './heat-level.component';
import { TiltDirective } from '../directives/tilt.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingComponent, HeatLevelComponent, TiltDirective],
  template: `
    <!-- GRID VIEW MODE -->
    @if (viewMode() === 'grid') {
      <div 
        [appTilt]="6" 
        [scale]="1.03"
        class="group relative flex flex-col justify-between overflow-hidden border-torn-card bg-sage-50/70 hover:bg-sage-100/50 border border-sage-200/40 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
      >
        <!-- Badge tags -->
        @if (product().tags.length > 0) {
          <div class="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
            @for (tag of product().tags.slice(0, 2); track tag) {
              <span class="text-[9px] font-extrabold uppercase tracking-wider text-moss-700 bg-sage-100/90 label-badge border border-sage-200 px-2.5 py-1.5 flex items-center gap-1">
                🌿 {{ tag }}
              </span>
            }
          </div>
        }

        <!-- Product Image container -->
        <div 
          [routerLink]="['/product', product().id]"
          class="relative w-full aspect-square bg-cinnamon-50 overflow-hidden cursor-pointer"
        >
          <img 
            [src]="product().images[0]" 
            [alt]="product().name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-90 brightness-95 contrast-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-peppercorn-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Product Details -->
        <div class="flex-grow flex flex-col p-4">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="text-[10px] font-bold text-saffron-600 uppercase tracking-widest">{{ product().category.replace('-', ' ') }}</span>
            <app-rating [rating]="product().rating" [showText]="false"></app-rating>
          </div>

          <h3 
            [routerLink]="['/product', product().id]"
            class="text-lg font-bold text-peppercorn-900 leading-snug group-hover:text-chili-600 transition-colors duration-200 cursor-pointer mb-1 line-clamp-1"
          >
            {{ product().name }}
          </h3>

          <p class="text-xs text-peppercorn-500 font-medium mb-3">
            Origin: {{ product().origin }}
          </p>

          <!-- Heat level / Description -->
          <div class="mb-3">
            <app-heat-level [level]="product().heatLevel"></app-heat-level>
          </div>

          <p class="text-xs text-peppercorn-600 line-clamp-2 mb-4 leading-relaxed flex-grow">
            {{ product().description }}
          </p>

          <!-- Price & CTA Action -->
          <div class="flex items-center justify-between pt-3 border-t border-cinnamon-50 mt-auto">
            <div>
              <span class="text-xs text-peppercorn-400 block font-medium">Price</span>
              <span class="text-lg font-extrabold text-peppercorn-950">{{ product().price | currency }}</span>
            </div>

            <button 
              (click)="onAddToCart($event)"
              [class.bg-moss-500]="isAdded()"
              [class.bg-gradient-to-r]="!isAdded()"
              [class.from-moss-700]="!isAdded()"
              [class.to-moss-600]="!isAdded()"
              [class.hover:from-saffron-600]="!isAdded()"
              [class.hover:to-saffron-500]="!isAdded()"
              class="relative flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
            >
              @if (isAdded()) {
                <svg class="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
                <span>Added!</span>
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                </svg>
                <span>Add</span>
              }
            </button>
          </div>
        </div>
      </div>
    } @else {
      <!-- LIST VIEW MODE -->
      <div class="flex flex-col md:flex-row gap-6 p-4 md:p-6 border-torn-card bg-sage-50/70 hover:bg-sage-100/50 border border-sage-200/40 shadow-sm hover:shadow-lg transition-all duration-300 w-full">
        <!-- Image container -->
        <div 
          [routerLink]="['/product', product().id]"
          class="relative w-full md:w-56 aspect-square md:aspect-auto md:h-48 bg-cinnamon-50 overflow-hidden rounded-xl cursor-pointer flex-shrink-0"
        >
          <img 
            [src]="product().images[0]" 
            [alt]="product().name"
            class="w-full h-full object-cover transition-transform duration-700 hover:scale-110 saturate-90 brightness-95 contrast-105"
            loading="lazy"
          />
          @if (product().tags.length > 0) {
            <span class="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider text-moss-700 bg-sage-100/90 label-badge border border-sage-200 px-2 py-0.5 flex items-center gap-1">
              🌿 {{ product().tags[0] }}
            </span>
          }
        </div>

        <!-- Description & Details -->
        <div class="flex-grow flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-3 mb-1.5">
              <span class="text-xs font-bold text-saffron-600 uppercase tracking-widest">{{ product().category.replace('-', ' ') }}</span>
              <span class="text-peppercorn-300">|</span>
              <app-rating [rating]="product().rating"></app-rating>
            </div>

            <h3 
              [routerLink]="['/product', product().id]"
              class="text-xl font-bold text-peppercorn-900 hover:text-chili-600 transition-colors duration-200 cursor-pointer mb-2"
            >
              {{ product().name }}
            </h3>

            <div class="flex flex-wrap items-center gap-4 mb-3">
              <p class="text-xs text-peppercorn-500 font-medium">Origin: {{ product().origin }}</p>
              <app-heat-level [level]="product().heatLevel"></app-heat-level>
            </div>

            <p class="text-xs text-peppercorn-600 leading-relaxed mb-4">
              {{ product().description }}
            </p>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-cinnamon-50 mt-auto">
            <div>
              <span class="text-xs text-peppercorn-400 block font-medium">Price</span>
              <span class="text-2xl font-extrabold text-peppercorn-950">{{ product().price | currency }}</span>
            </div>

            <button 
              (click)="onAddToCart($event)"
              [class.bg-moss-500]="isAdded()"
              [class.bg-gradient-to-r]="!isAdded()"
              [class.from-moss-700]="!isAdded()"
              [class.to-moss-600]="!isAdded()"
              [class.hover:from-saffron-600]="!isAdded()"
              [class.hover:to-saffron-500]="!isAdded()"
              class="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all duration-300 hover:scale-105 active:scale-95"
            >
              @if (isAdded()) {
                <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
                <span>Item Added!</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                </svg>
                <span>Add to Cart</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);

  readonly product = input.required<Product>();
  readonly viewMode = input<'grid' | 'list'>('grid');

  protected readonly isAdded = signal(false);

  onAddToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product(), 1);
    this.isAdded.set(true);
    setTimeout(() => {
      this.isAdded.set(false);
    }, 1500);
  }
}
