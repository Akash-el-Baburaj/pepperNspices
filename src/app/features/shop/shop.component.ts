import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { Product } from '../../core/mock-data/data';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  template: `
    <div class="min-h-screen bg-sage-50 pt-32 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- SHOP HEADER / BANNER -->
        <div class="mb-12 text-center md:text-left">
          <span class="text-xs font-extrabold text-moss-700 uppercase tracking-widest block mb-1">Sasya Catalog</span>
          <h1 class="text-4xl font-extrabold font-display text-peppercorn-950">Apothecary of Spices</h1>
          <p class="text-xs md:text-sm text-peppercorn-500 max-w-xl mt-2 font-medium">
            Browse our curated collections, filter by heat level or harvest origin, and elevate your culinary creations.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- FILTERS COL - DESKTOP SIDEBAR -->
          <aside class="hidden lg:block space-y-8 bg-parchment border border-sage-200/50 rounded-3xl p-6 shadow-xs h-fit border-torn-card">
            <div class="flex items-center justify-between pb-4 border-b border-sage-100">
              <h3 class="text-xs font-extrabold uppercase tracking-widest text-peppercorn-900">Filters</h3>
              <button (click)="resetFilters()" class="text-[10px] font-bold text-moss-700 hover:text-moss-900 uppercase tracking-wider transition-colors">Clear All</button>
            </div>

            <!-- Categories Filter -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Collections</h4>
              <div class="space-y-2">
                <button 
                  (click)="setCategory('all')"
                  [class.text-moss-700]="selectedCategory() === 'all'"
                  [class.font-bold]="selectedCategory() === 'all'"
                  [class.text-peppercorn-600]="selectedCategory() !== 'all'"
                  class="flex items-center justify-between w-full text-xs font-medium hover:text-moss-700 transition-colors text-left"
                >
                  <span>All Spices</span>
                  <span class="text-[10px] font-bold bg-sage-100 px-2 py-0.5 rounded-full text-peppercorn-600">{{ totalAvailable() }}</span>
                </button>
                @for (c of categoriesList(); track c) {
                  <button 
                    (click)="setCategory(c)"
                    [class.text-moss-700]="selectedCategory() === c"
                    [class.font-bold]="selectedCategory() === c"
                    [class.text-peppercorn-600]="selectedCategory() !== c"
                    class="flex items-center justify-between w-full text-xs font-medium hover:text-moss-700 transition-colors text-left capitalize"
                  >
                    <span>{{ c.replace('-', ' ') }}</span>
                    <span class="text-[10px] font-bold bg-sage-100 px-2 py-0.5 rounded-full text-peppercorn-600">{{ categoryCounts()[c] || 0 }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Heat Level Filter -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Spice Severity (Heat)</h4>
              <div class="space-y-2">
                <button 
                  (click)="setHeat(null)"
                  [class.text-moss-700]="selectedHeat() === null"
                  [class.font-bold]="selectedHeat() === null"
                  [class.text-peppercorn-600]="selectedHeat() !== null"
                  class="flex items-center gap-2 w-full text-xs font-medium hover:text-moss-700 transition-colors text-left"
                >
                  <span>All Heat Levels</span>
                </button>
                @for (h of [0, 1, 2, 3, 4, 5]; track h) {
                  <button 
                    (click)="setHeat(h)"
                    [class.text-moss-700]="selectedHeat() === h"
                    [class.font-bold]="selectedHeat() === h"
                    [class.text-peppercorn-600]="selectedHeat() !== h"
                    class="flex items-center gap-1.5 w-full text-xs font-medium hover:text-moss-700 transition-colors text-left"
                  >
                    @if (h === 0) {
                      <span class="text-xs">🟢 Sweet / Mild</span>
                    } @else {
                      <div class="flex items-center text-chili-600">
                        @for (star of [].constructor(h); track $index) {
                          <span>🔥</span>
                        }
                      </div>
                      <span class="text-[10px] text-peppercorn-400 font-bold ml-1">
                        ({{ h === 1 ? 'Warm' : h === 2 ? 'Spicy' : h === 3 ? 'Hot' : h === 4 ? 'Fiery' : 'Extreme' }})
                      </span>
                    }
                  </button>
                }
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Max Price</h4>
                <span class="text-xs font-extrabold text-peppercorn-900 bg-sage-100 px-2 py-0.5 rounded-lg">{{ maxPrice() | currency }}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                [ngModel]="maxPrice()"
                (ngModelChange)="maxPrice.set($event)"
                class="w-full h-1 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-moss-600"
              />
              <div class="flex items-center justify-between text-[10px] text-peppercorn-400 font-bold">
                <span>$10</span>
                <span>$100</span>
              </div>
            </div>

            <!-- Origin Filter -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Origin Estate</h4>
              <select 
                [ngModel]="selectedOrigin()"
                (ngModelChange)="selectedOrigin.set($event)"
                class="w-full text-xs font-medium px-3 py-2 bg-sage-50/50 border border-sage-200 rounded-xl focus:outline-none focus:border-moss-500 transition-colors"
              >
                <option value="all">All Origins</option>
                @for (origin of originsList(); track origin) {
                  <option [value]="origin">{{ origin }}</option>
                }
              </select>
            </div>
          </aside>

          <!-- MAIN PRODUCTS CONTAINER -->
          <div class="lg:col-span-3 space-y-6">
            
            <!-- CONTROLS BAR (GRID/LIST, SORT) -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-parchment border border-sage-200/50 shadow-xs">
              <div class="text-xs text-peppercorn-500 font-medium">
                Showing <span class="font-extrabold text-peppercorn-950">{{ filteredProducts().length }}</span> of <span class="font-bold text-peppercorn-700">{{ products().length }}</span> spices
              </div>

              <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <!-- Grid vs List Toggle -->
                <div class="flex items-center gap-1 bg-sage-100/60 p-1 rounded-xl">
                  <button 
                    (click)="viewMode.set('grid')"
                    [class.bg-white]="viewMode() === 'grid'"
                    [class.text-peppercorn-950]="viewMode() === 'grid'"
                    [class.shadow-xs]="viewMode() === 'grid'"
                    [class.text-peppercorn-400]="viewMode() !== 'grid'"
                    class="p-1.5 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z"/>
                    </svg>
                  </button>
                  <button 
                    (click)="viewMode.set('list')"
                    [class.bg-white]="viewMode() === 'list'"
                    [class.text-peppercorn-950]="viewMode() === 'list'"
                    [class.shadow-xs]="viewMode() === 'list'"
                    [class.text-peppercorn-400]="viewMode() !== 'list'"
                    class="p-1.5 rounded-lg flex items-center justify-center transition-all duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                    </svg>
                  </button>
                </div>

                <!-- Sorting selection -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-peppercorn-500 font-bold hidden sm:inline">Sort:</span>
                  <select 
                    [ngModel]="sortBy()"
                    (ngModelChange)="sortBy.set($event)"
                    class="text-xs font-bold text-peppercorn-900 border-none bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- COLLAPSIBLE FILTERS PANEL (MOBILE ONLY) -->
            <div class="lg:hidden">
              <details class="bg-parchment border border-sage-200/60 rounded-2xl shadow-xs group overflow-hidden">
                <summary class="flex items-center justify-between p-4 cursor-pointer text-xs font-extrabold uppercase tracking-widest text-peppercorn-900 select-none">
                  <span>Toggle Filtering Controls</span>
                  <span class="text-saffron-600 group-open:rotate-180 transition-transform duration-200">▼</span>
                </summary>
                
                <div class="p-6 border-t border-sage-100 space-y-6">
                  <!-- Category Mobile List -->
                  <div class="space-y-2">
                    <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Collections</h4>
                    <div class="flex flex-wrap gap-1.5">
                      <button 
                        (click)="setCategory('all')"
                        [class.bg-moss-700]="selectedCategory() === 'all'"
                        [class.text-white]="selectedCategory() === 'all'"
                        [class.bg-sage-100]="selectedCategory() !== 'all'"
                        [class.text-peppercorn-700]="selectedCategory() !== 'all'"
                        class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200"
                      >
                        All Spices
                      </button>
                      @for (c of categoriesList(); track c) {
                        <button 
                          (click)="setCategory(c)"
                          [class.bg-moss-700]="selectedCategory() === c"
                          [class.text-white]="selectedCategory() === c"
                          [class.bg-sage-100]="selectedCategory() !== c"
                          [class.text-peppercorn-700]="selectedCategory() !== c"
                          class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 capitalize"
                        >
                          {{ c.replace('-', ' ') }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Heat Mobile List -->
                  <div class="space-y-2">
                    <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Heat Intensity</h4>
                    <div class="flex flex-wrap gap-1.5">
                      <button 
                        (click)="setHeat(null)"
                        [class.bg-moss-700]="selectedHeat() === null"
                        [class.text-white]="selectedHeat() === null"
                        [class.bg-sage-100]="selectedHeat() !== null"
                        [class.text-peppercorn-700]="selectedHeat() !== null"
                        class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200"
                      >
                        All Heat
                      </button>
                      @for (h of [0, 1, 2, 3, 4, 5]; track h) {
                        <button 
                          (click)="setHeat(h)"
                          [class.bg-moss-700]="selectedHeat() === h"
                          [class.text-white]="selectedHeat() === h"
                          [class.bg-sage-100]="selectedHeat() !== h"
                          [class.text-peppercorn-700]="selectedHeat() !== h"
                          class="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200"
                        >
                          {{ h === 0 ? 'Mild' : h + ' 🔥' }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Price & Origin Mobile -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Max Price ({{ maxPrice() | currency }})</h4>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5"
                        [ngModel]="maxPrice()"
                        (ngModelChange)="maxPrice.set($event)"
                        class="w-full h-1 bg-sage-200 rounded-lg appearance-none cursor-pointer accent-moss-600"
                      />
                    </div>
                    <div class="space-y-2">
                      <h4 class="text-xs font-extrabold text-peppercorn-950 uppercase tracking-wider">Origin Estate</h4>
                      <select 
                        [ngModel]="selectedOrigin()"
                        (ngModelChange)="selectedOrigin.set($event)"
                        class="w-full text-xs font-medium px-3 py-2 bg-sage-50/50 border border-sage-200 rounded-xl"
                      >
                        <option value="all">All Origins</option>
                        @for (origin of originsList(); track origin) {
                          <option [value]="origin">{{ origin }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <button 
                    (click)="resetFilters()"
                    class="w-full text-center py-2.5 bg-cinnamon-100 text-peppercorn-700 text-xs font-extrabold rounded-xl uppercase tracking-wider hover:bg-cinnamon-250 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              </details>
            </div>

            <!-- SKELETON LOADER STATE -->
            @if (isLoading()) {
              <!-- Sasya custom splash loading pulse -->
              <div class="col-span-full flex flex-col items-center justify-center py-8 text-center space-y-3 select-none animate-pulse">
                <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md border border-cinnamon-100">
                  <img src="/images/sasya-logo.png" alt="Sasya" class="w-full h-full object-contain" />
                </div>
                <span class="text-[10px] font-extrabold text-moss-700 uppercase tracking-widest block">Opening Sasya Vaults...</span>
              </div>

              <div 
                [class.grid]="viewMode() === 'grid'"
                [class.grid-cols-1]="viewMode() === 'grid'"
                [class.sm:grid-cols-2]="viewMode() === 'grid'"
                [class.lg:grid-cols-3]="viewMode() === 'grid'"
                [class.space-y-4]="viewMode() === 'list'"
                class="gap-8"
              >
                @for (skele of [1, 2, 3, 4, 5, 6]; track skele) {
                  @if (viewMode() === 'grid') {
                    <div class="animate-pulse flex flex-col rounded-2xl bg-white border border-cinnamon-100 p-4 h-96">
                      <div class="w-full aspect-square bg-cinnamon-100 rounded-xl mb-4"></div>
                      <div class="h-3 bg-cinnamon-100 rounded w-1/4 mb-2"></div>
                      <div class="h-6 bg-cinnamon-100 rounded w-3/4 mb-2"></div>
                      <div class="h-3 bg-cinnamon-100 rounded w-1/2 mb-4"></div>
                      <div class="h-3 bg-cinnamon-100 rounded w-full mb-2"></div>
                      <div class="h-3 bg-cinnamon-100 rounded w-5/6 mb-4"></div>
                      <div class="h-9 bg-cinnamon-100 rounded-xl w-full mt-auto"></div>
                    </div>
                  } @else {
                    <div class="animate-pulse flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-white border border-cinnamon-100">
                      <div class="w-full md:w-56 h-48 bg-cinnamon-100 rounded-xl"></div>
                      <div class="flex-grow space-y-3 py-2">
                        <div class="h-3 bg-cinnamon-100 rounded w-1/5"></div>
                        <div class="h-6 bg-cinnamon-100 rounded w-2/5"></div>
                        <div class="h-3 bg-cinnamon-100 rounded w-1/3"></div>
                        <div class="h-3 bg-cinnamon-100 rounded w-full"></div>
                        <div class="h-3 bg-cinnamon-100 rounded w-4/5"></div>
                        <div class="h-8 bg-cinnamon-100 rounded-xl w-32 mt-4"></div>
                      </div>
                    </div>
                  }
                }
              </div>
            } @else {
              <!-- EMPTY STATE -->
              @if (filteredProducts().length === 0) {
                <div class="text-center py-20 bg-parchment border border-sage-200/50 rounded-3xl p-12 border-torn-card">
                  <span class="text-5xl">🌿</span>
                  <h3 class="text-xl font-bold text-peppercorn-950 font-display mt-4">No Spices Found</h3>
                  <p class="text-xs text-peppercorn-500 max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                    We couldn't find any spices in our vaults matching those exact filter options. Try loosening your price threshold or selecting "All Heat Levels".
                  </p>
                  <button 
                    (click)="resetFilters()" 
                    class="mt-6 px-6 py-2.5 bg-gradient-to-r from-moss-700 to-moss-600 hover:from-saffron-600 hover:to-saffron-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              } @else {
                <!-- PRODUCTS GRID / LIST -->
                <div 
                  [class.grid]="viewMode() === 'grid'"
                  [class.grid-cols-1]="viewMode() === 'grid'"
                  [class.sm:grid-cols-2]="viewMode() === 'grid'"
                  [class.lg:grid-cols-3]="viewMode() === 'grid'"
                  [class.space-y-6]="viewMode() === 'list'"
                  class="gap-8"
                >
                  @for (prod of filteredProducts(); track prod.id) {
                    <app-product-card [product]="prod" [viewMode]="viewMode()"></app-product-card>
                  }
                </div>
              }
            }

          </div>

        </div>

      </div>
    </div>
  `
})
export class ShopComponent implements OnInit {
  private readonly mockApi = inject(MockApiService);
  private readonly route = inject(ActivatedRoute);

  // Raw states
  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);
  
  // Filter states
  protected readonly selectedCategory = signal<string>('all');
  protected readonly selectedHeat = signal<number | null>(null);
  protected readonly maxPrice = signal<number>(100);
  protected readonly selectedOrigin = signal<string>('all');
  protected readonly sortBy = signal<string>('popularity');
  
  // View mode
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  // Available metadata computed from loaded products
  protected readonly categoriesList = computed(() => {
    const cats = new Set(this.products().map(p => p.category));
    return Array.from(cats);
  });

  protected readonly categoryCounts = computed(() => {
    const counts: { [key: string]: number } = {};
    for (const p of this.products()) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  });

  protected readonly totalAvailable = computed(() => this.products().length);

  protected readonly originsList = computed(() => {
    // Simplify/Extract country names for clean filtering
    const origins = this.products().map(p => {
      const parts = p.origin.split(',');
      return parts[parts.length - 1].trim();
    });
    return Array.from(new Set(origins));
  });

  // REACTIVELY FILTERED & SORTED LIST
  protected readonly filteredProducts = computed(() => {
    let items = this.products();

    // 1. Filter by category
    const cat = this.selectedCategory();
    if (cat !== 'all') {
      items = items.filter(p => p.category === cat);
    }

    // 2. Filter by heat level
    const heat = this.selectedHeat();
    if (heat !== null) {
      items = items.filter(p => p.heatLevel === heat);
    }

    // 3. Filter by price threshold
    const price = this.maxPrice();
    items = items.filter(p => p.price <= price);

    // 4. Filter by origin
    const origin = this.selectedOrigin();
    if (origin !== 'all') {
      items = items.filter(p => p.origin.toLowerCase().includes(origin.toLowerCase()));
    }

    // 5. Apply sorting
    const sort = this.sortBy();
    items = [...items]; // Clone before sort
    if (sort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else {
      // 'popularity' or default: sort by rating desc first, then stock count
      items.sort((a, b) => b.rating - a.rating || b.stock - a.stock);
    }

    return items;
  });

  ngOnInit() {
    this.mockApi.getProducts().subscribe(prods => {
      this.products.set(prods);
      this.isLoading.set(false);
    });

    // Query Params listener (for navbar filters)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
    });
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  setHeat(heat: number | null) {
    this.selectedHeat.set(heat);
  }

  resetFilters() {
    this.selectedCategory.set('all');
    this.selectedHeat.set(null);
    this.maxPrice.set(100);
    this.selectedOrigin.set('all');
    this.sortBy.set('popularity');
  }
}
