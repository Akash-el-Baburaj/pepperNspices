import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { Product } from '../../core/mock-data/data';
import { CartService } from '../../core/services/cart.service';
import { RatingComponent } from '../../shared/components/rating.component';
import { HeatLevelComponent } from '../../shared/components/heat-level.component';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { ActivityTrackingService } from '../../core/services/activity-tracking.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingComponent, HeatLevelComponent, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- BREADCRUMBS -->
        <nav class="flex text-xs font-semibold uppercase tracking-widest text-peppercorn-400 gap-2 mb-8 select-none">
          <a routerLink="/" class="hover:text-chili-600 transition-colors">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-chili-600 transition-colors">Shop</a>
          <span>/</span>
          <span class="text-peppercorn-900 truncate">{{ product()?.name }}</span>
        </nav>

        <!-- SKELETON STATE -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-cinnamon-100 rounded-3xl p-6 md:p-12 animate-pulse">
            <div class="lg:col-span-6 space-y-4">
              <div class="w-full aspect-square bg-cinnamon-100 rounded-2xl"></div>
              <div class="flex gap-4">
                <div class="w-20 h-20 bg-cinnamon-100 rounded-xl"></div>
                <div class="w-20 h-20 bg-cinnamon-100 rounded-xl"></div>
              </div>
            </div>
            <div class="lg:col-span-6 space-y-4 py-4">
              <div class="h-4 bg-cinnamon-100 rounded w-1/4"></div>
              <div class="h-10 bg-cinnamon-100 rounded w-3/4"></div>
              <div class="h-4 bg-cinnamon-100 rounded w-1/3"></div>
              <div class="h-8 bg-cinnamon-100 rounded w-1/5"></div>
              <div class="h-20 bg-cinnamon-100 rounded w-full"></div>
              <div class="h-12 bg-cinnamon-100 rounded-xl w-full"></div>
            </div>
          </div>
        } @else {
          <!-- PRODUCT CARD WRAPPER -->
          @if (product(); as p) {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-cinnamon-100 rounded-3xl p-6 md:p-12 shadow-sm mb-20">
              
              <!-- LEFT COLUMN: IMAGE GALLERY WITH HOVER ZOOM -->
              <div class="lg:col-span-6 space-y-6">
                <!-- Large main image with hover-zoom container -->
                <div 
                  (mousemove)="onZoom($event)"
                  (mouseleave)="onZoomLeave()"
                  class="relative w-full aspect-square bg-cinnamon-50/50 border border-cinnamon-100 rounded-2xl overflow-hidden cursor-crosshair shadow-xs select-none"
                >
                  <img 
                    [src]="activeImage()" 
                    [alt]="p.name"
                    class="w-full h-full object-cover origin-center transition-transform duration-100"
                    [class.scale-200]="isZoomed()"
                    [style.transform-origin]="zoomOrigin()"
                  />
                  
                  <!-- Magnify icon instructions overlay -->
                  <div class="absolute bottom-4 right-4 bg-peppercorn-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1.5 pointer-events-none">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                    </svg>
                    <span>Hover to Zoom</span>
                  </div>
                </div>

                <!-- Thumbnails grid -->
                <div class="flex gap-4">
                  @for (img of p.images; track img) {
                    <button 
                      (click)="activeImage.set(img)"
                      [class.border-chili-600]="activeImage() === img"
                      [class.ring-2]="activeImage() === img"
                      [class.ring-chili-600/20]="activeImage() === img"
                      [class.border-cinnamon-100]="activeImage() !== img"
                      class="w-20 h-20 rounded-xl overflow-hidden border-2 bg-cinnamon-50 focus:outline-none transition-all duration-200"
                    >
                      <img [src]="img" [alt]="p.name" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              </div>

              <!-- RIGHT COLUMN: PRODUCT INFO & SELECTION -->
              <div class="lg:col-span-6 space-y-6">
                <div>
                  <div class="flex items-center gap-3 mb-2 flex-wrap">
                    <span class="text-xs font-extrabold text-saffron-600 uppercase tracking-widest">{{ p.category.replace('-', ' ') }}</span>
                    <span class="text-peppercorn-200">|</span>
                    <app-rating [rating]="p.rating"></app-rating>
                    <span class="text-xs text-peppercorn-400 font-bold ml-1">Reviews (42)</span>
                  </div>
                  
                  <h1 class="text-3xl md:text-4xl font-extrabold text-peppercorn-950 font-display tracking-tight leading-tight">
                    {{ p.name }}
                  </h1>
                  <p class="text-xs text-peppercorn-500 font-semibold mt-1">Origin Harvest: {{ p.origin }}</p>
                </div>

                <div class="flex items-center gap-4 py-4 border-y border-cinnamon-50 flex-wrap">
                  <div class="text-3xl font-extrabold text-peppercorn-950">{{ p.price | currency }}</div>
                  <div class="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-lg"
                       [class.bg-emerald-50]="p.stock > 0" [class.text-emerald-700]="p.stock > 0"
                       [class.bg-red-50]="p.stock === 0" [class.text-red-700]="p.stock === 0">
                    {{ p.stock > 0 ? '✓ In Vault (' + p.stock + ' Available)' : '✗ Out of Vault' }}
                  </div>
                </div>

                <!-- Heat severity widget -->
                <app-heat-level [level]="p.heatLevel"></app-heat-level>

                <p class="text-sm text-peppercorn-600 leading-relaxed">
                  {{ p.description }}
                </p>

                <!-- Quantity & Add to Cart Controls -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-cinnamon-50">
                  <div class="flex items-center justify-between border-2 border-cinnamon-100 rounded-2xl p-1 bg-cinnamon-50/50 w-full sm:w-32">
                    <button 
                      (click)="decrementQty()" 
                      [disabled]="quantity() <= 1"
                      class="w-10 h-10 flex items-center justify-center font-extrabold text-lg text-peppercorn-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded-xl transition-all"
                    >
                      −
                    </button>
                    <span class="text-sm font-extrabold text-peppercorn-900 select-none w-8 text-center">{{ quantity() }}</span>
                    <button 
                      (click)="incrementQty()"
                      [disabled]="quantity() >= p.stock"
                      class="w-10 h-10 flex items-center justify-center font-extrabold text-lg text-peppercorn-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded-xl transition-all"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    (click)="onAddToCart()"
                    [disabled]="p.stock === 0"
                    [class.bg-emerald-600]="isAdded()"
                    [class.hover:bg-emerald-700]="isAdded()"
                    [class.bg-chili-600]="!isAdded() && p.stock > 0"
                    [class.hover:bg-chili-700]="!isAdded() && p.stock > 0"
                    [class.bg-gray-300]="p.stock === 0"
                    class="flex-grow px-8 py-4 text-white text-sm font-extrabold rounded-2xl shadow-md transition-all duration-300 hover:scale-103 active:scale-97 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    @if (isAdded()) {
                      <svg class="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                      </svg>
                      <span>Spice Package Added!</span>
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                      </svg>
                      <span>{{ p.stock > 0 ? 'Add to Cart Package' : 'Sold Out' }}</span>
                    }
                  </button>
                </div>

                <!-- TABS (STORY, USAGE, NUTRITIONAL) -->
                <div class="pt-6 border-t border-cinnamon-50 space-y-4">
                  <!-- Tab toggles -->
                  <div class="flex border-b border-cinnamon-100 gap-6">
                    @for (tab of ['story', 'usage', 'nutritional']; track tab) {
                      <button 
                        (click)="activeTab.set(tab)"
                        [class.border-chili-600]="activeTab() === tab"
                        [class.text-chili-600]="activeTab() === tab"
                        [class.font-extrabold]="activeTab() === tab"
                        [class.border-transparent]="activeTab() !== tab"
                        [class.text-peppercorn-500]="activeTab() !== tab"
                        class="pb-2 border-b-2 text-xs uppercase tracking-wider font-bold transition-all"
                      >
                        {{ tab === 'story' ? 'Origin Story' : tab === 'usage' ? 'Usage & Guide' : 'Nutrition Info' }}
                      </button>
                    }
                  </div>

                  <!-- Tab Panels -->
                  <div class="text-xs text-peppercorn-600 leading-relaxed font-medium">
                    @if (activeTab() === 'story') {
                      <p class="animate-fade-in text-[13px] leading-relaxed">{{ p.story }}</p>
                    } @else if (activeTab() === 'usage') {
                      <p class="animate-fade-in text-[13px] leading-relaxed">{{ p.usage }}</p>
                    } @else if (activeTab() === 'nutritional') {
                      <p class="animate-fade-in text-[13px] leading-relaxed font-mono bg-cinnamon-50/50 p-4 border border-cinnamon-100 rounded-xl">{{ p.nutritionalInfo }}</p>
                    }
                  </div>
                </div>

              </div>

            </div>

            <!-- RELATED PRODUCTS CAROUSEL -->
            @if (relatedProducts().length > 0) {
              <div>
                <h3 class="text-2xl font-bold font-display text-peppercorn-950 mb-8 border-b border-cinnamon-100 pb-3">Related Harvests</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  @for (r of relatedProducts().slice(0, 4); track r.id) {
                    <app-product-card [product]="r" viewMode="grid"></app-product-card>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="text-center py-24 bg-white border border-cinnamon-100 rounded-3xl p-12">
              <span class="text-5xl">🌾</span>
              <h3 class="text-xl font-bold text-peppercorn-950 font-display mt-4">Spice Vault Empty</h3>
              <p class="text-xs text-peppercorn-500 max-w-sm mx-auto mt-2 leading-relaxed">
                The product identifier you requested could not be located in our inventory shelves.
              </p>
              <button 
                routerLink="/shop" 
                class="mt-6 px-6 py-2.5 bg-chili-600 text-white text-xs font-bold rounded-xl shadow-md hover:scale-105 active:scale-95 transition-transform"
              >
                Return to Shop
              </button>
            </div>
          }
        }

      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private readonly mockApi = inject(MockApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly activityService = inject(ActivityTrackingService);

  // States
  protected readonly product = signal<Product | null>(null);
  protected readonly relatedProducts = signal<Product[]>([]);
  protected readonly isLoading = signal(true);

  // Gallery and options states
  protected readonly activeImage = signal<string>('');
  protected readonly quantity = signal<number>(1);
  protected readonly isAdded = signal<boolean>(false);
  protected readonly activeTab = signal<string>('story');

  // Interactive Zoom settings
  protected readonly isZoomed = signal<boolean>(false);
  protected readonly zoomOrigin = signal<string>('center center');

  ngOnInit() {
    // Listen to route params change (to support switching between related products)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: string) {
    this.isLoading.set(true);
    this.quantity.set(1);
    this.activeTab.set('story');

    this.mockApi.getProductById(id).subscribe(p => {
      if (p) {
        this.product.set(p);
        this.activeImage.set(p.images[0]);
        this.isLoading.set(false);
        this.activityService.track('VIEW_PRODUCT', `Viewed product: ${p.name}`, { productId: p.id, category: p.category });

        // Load related items
        this.mockApi.getProducts().subscribe(allProds => {
          this.relatedProducts.set(
            allProds.filter(item => item.category === p.category && item.id !== p.id)
          );
        });
      } else {
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  incrementQty() {
    const stockLimit = this.product()?.stock || 10;
    this.quantity.update(qty => Math.min(stockLimit, qty + 1));
  }

  decrementQty() {
    this.quantity.update(qty => Math.max(1, qty - 1));
  }

  onAddToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.isAdded.set(true);
      setTimeout(() => {
        this.isAdded.set(false);
      }, 1500);
    }
  }

  // Magnify zoom calculation
  onZoom(event: MouseEvent) {
    this.isZoomed.set(true);
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Map mouse coordinates to percentages
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    this.zoomOrigin.set(`${xPercent}% ${yPercent}%`);
  }

  onZoomLeave() {
    this.isZoomed.set(false);
    this.zoomOrigin.set('center center');
  }
}
