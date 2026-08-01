import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { Product, Category, Testimonial } from '../../core/mock-data/data';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { ProductCardComponent } from '../../shared/components/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ParallaxDirective, TiltDirective, ProductCardComponent],
  template: `
    <div class="relative w-full overflow-hidden">
      
      <!-- HERO BANNER -->
      <section class="relative h-[95vh] flex items-center justify-center overflow-hidden bg-peppercorn-950">
        <!-- Parallax Background Image -->
        <div 
          [appParallax]="-0.3"
          class="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center opacity-40 mix-blend-luminosity"
          style="background-image: url('/images/spices-hero-bg.png');"
        ></div>

        <!-- Canvas Spice Particles Background -->
        <canvas #canvas class="absolute inset-0 pointer-events-none z-10 w-full h-full opacity-60"></canvas>

        <!-- Warm Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-peppercorn-950 via-peppercorn-950/30 to-peppercorn-950/20 z-0"></div>

        <!-- Foreground Content -->
        <div class="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-6">
          <span class="inline-block text-xs md:text-sm font-extrabold text-saffron-400 uppercase tracking-widest bg-saffron-950/80 border border-saffron-800/40 px-4 py-1.5 rounded-full backdrop-blur-xs">
            ✨ Pure Single-Origin Harvests
          </span>
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight font-display tracking-tight">
            Flavors Born of <br class="hidden md:inline"/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-chili-500 via-saffron-400 to-chili-400">Sun & Earth</span>
          </h1>
          <p class="text-sm md:text-lg text-cinnamon-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover rare peppercorns, stone-ground chilies, and curated spice blends sourced directly from small heritage farms around the globe.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              routerLink="/shop" 
              class="w-full sm:w-auto px-8 py-4 bg-chili-600 hover:bg-chili-500 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-chili-600/20 transition-all duration-300 hover:scale-105 active:scale-95 text-center"
            >
              Explore Shop
            </a>
            <a 
              routerLink="/about" 
              class="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 text-center border border-white/10"
            >
              Our Story
            </a>
          </div>
        </div>

        <!-- Down Arrow Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg class="w-6 h-6 text-saffron-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
          </svg>
        </div>
      </section>

      <!-- TRUST BADGES / CHOOSE US -->
      <section class="py-12 bg-cinnamon-100/60 border-y border-cinnamon-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-cinnamon-200/50 shadow-xs">
              <span class="text-3xl p-3 bg-saffron-100 rounded-2xl text-saffron-700">🌱</span>
              <div>
                <h3 class="text-sm font-bold text-peppercorn-900 uppercase tracking-wider">100% Single Origin</h3>
                <p class="text-xs text-peppercorn-600 mt-0.5">Sourced from single, verified heritage estates.</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-cinnamon-200/50 shadow-xs">
              <span class="text-3xl p-3 bg-chili-100 rounded-2xl text-chili-700">🥣</span>
              <div>
                <h3 class="text-sm font-bold text-peppercorn-900 uppercase tracking-wider">Small-Batch Ground</h3>
                <p class="text-xs text-peppercorn-600 mt-0.5">Stone-ground weekly to preserve volatile oils.</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 rounded-xl bg-white/50 border border-cinnamon-200/50 shadow-xs">
              <span class="text-3xl p-3 bg-cinnamon-100 rounded-2xl text-cinnamon-700">🤝</span>
              <div>
                <h3 class="text-sm font-bold text-peppercorn-900 uppercase tracking-wider">Direct Trade Ethics</h3>
                <p class="text-xs text-peppercorn-600 mt-0.5">Fair premiums paid directly to local cultivators.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CATEGORY TILES -->
      <section class="py-24 bg-cinnamon-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-xl mx-auto mb-16">
            <span class="text-xs font-extrabold text-chili-600 uppercase tracking-widest">Spice Classes</span>
            <h2 class="text-3xl md:text-4xl font-bold text-peppercorn-950 font-display mt-2">Explore the Pantry</h2>
            <div class="w-12 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            @for (cat of categories(); track cat.id) {
              <div 
                [routerLink]="['/shop']" 
                [queryParams]="{category: cat.slug}"
                class="group relative h-72 rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-cinnamon-100 cursor-pointer transition-all duration-300"
              >
                <img 
                  [src]="cat.image" 
                  [alt]="cat.name" 
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-peppercorn-950/90 via-peppercorn-950/45 to-transparent"></div>
                
                <div class="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end h-full">
                  <h3 class="text-lg font-bold font-display group-hover:text-saffron-400 transition-colors duration-200">{{ cat.name }}</h3>
                  <p class="text-[10px] text-gray-300 line-clamp-2 mt-1 leading-normal font-medium">
                    {{ cat.description }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- PARALLAX PRODUCT SHOWCASE -->
      <section class="relative py-28 bg-peppercorn-950 text-white overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-peppercorn-950 to-peppercorn-900"></div>

        <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <!-- Text & Detail Column -->
            <div class="lg:col-span-5 space-y-6">
              <span class="text-xs font-extrabold text-saffron-400 uppercase tracking-widest block">Signature Highlight</span>
              <h2 class="text-4xl md:text-5xl font-bold font-display leading-tight">Kampot Black Pepper</h2>
              <div class="w-12 h-1 bg-chili-600 rounded-full"></div>
              
              <p class="text-sm text-gray-300 leading-relaxed font-medium">
                Deep from the quartz-rich soil of Cambodia's southern hills, Kampot Pepper delivers a sharp, lingering bite combined with a sweet undertone of dark fruit, jasmine, and citrus. 
              </p>
              
              <div class="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                <span class="text-2xl">🏆</span>
                <div>
                  <h4 class="text-xs font-bold text-saffron-400">PGI Certified</h4>
                  <p class="text-[10px] text-gray-400 mt-0.5">Protected Geographical Indication guarantees authenticity and farming traditions.</p>
                </div>
              </div>

              <div class="pt-4">
                <a 
                  routerLink="/product/prod_1" 
                  class="inline-block px-6 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Discover Kampot
                </a>
              </div>
            </div>

            <!-- Parallax Visual showcase Column -->
            <div class="lg:col-span-7 relative h-[500px] flex items-center justify-center">
              <!-- Back Circle Layer -->
              <div class="absolute w-72 h-72 md:w-[420px] md:h-[420px] bg-cinnamon-700/20 rounded-full blur-xl"></div>
              
              <!-- Background Slate Board (Moves Slower) -->
              <div 
                [appParallax]="-0.08"
                class="absolute w-[280px] h-[340px] md:w-[360px] md:h-[440px] bg-peppercorn-900 border border-white/10 rounded-3xl shadow-2xl flex items-center justify-center p-6 z-0"
              >
                <!-- Vintage style text design on slate -->
                <div class="w-full h-full border border-white/5 rounded-2xl flex flex-col justify-between p-4 text-center">
                  <span class="text-[10px] text-white/20 tracking-widest font-extrabold uppercase">ORIGINAL CULTIVARS</span>
                  <div class="border-y border-white/10 py-6 my-auto">
                    <span class="text-xs text-saffron-400 font-bold tracking-widest uppercase block">KAMPOT STATE</span>
                    <span class="text-[9px] text-gray-400 block mt-1">CULTIVATED SINCE 13TH CENTURY</span>
                  </div>
                  <span class="text-[10px] text-white/20 tracking-wider">HALDI & HORN IMPORTERS</span>
                </div>
              </div>

              <!-- Foreground Product Image Layer (Moves Faster / Offsets) -->
              <div 
                [appParallax]="0.12"
                [appTilt]="8"
                class="absolute w-[200px] h-[280px] md:w-[260px] md:h-[360px] z-10 left-[10%] md:left-[15%] top-[15%] shadow-3xl overflow-hidden rounded-2xl cursor-pointer"
                [routerLink]="['/product/prod_1']"
              >
                <img 
                  src="/images/kampot-1.png" 
                  alt="Kampot Pepper jar" 
                  class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <!-- Decorative floating leaf or seed layer (Moves Very Fast) -->
              <div 
                [appParallax]="0.25"
                class="absolute w-20 h-20 md:w-28 md:h-28 z-20 right-[5%] bottom-[10%] drop-shadow-2xl pointer-events-none"
              >
                <!-- Floating pepper corn image/illustration -->
                <img 
                  src="/images/kampot-2.png" 
                  alt="floating peppercorns" 
                  class="w-full h-full object-cover rounded-full border-2 border-saffron-500/20"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- FEATURED PRODUCTS -->
      <section class="py-24 bg-cinnamon-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <span class="text-xs font-extrabold text-chili-600 uppercase tracking-widest">Handpicked Favorites</span>
              <h2 class="text-3xl md:text-4xl font-bold text-peppercorn-950 font-display mt-2">The Merchant's Chest</h2>
            </div>
            <a 
              routerLink="/shop" 
              class="text-xs font-extrabold text-chili-600 hover:text-chili-700 hover:underline flex items-center gap-1 uppercase tracking-wider transition-all duration-200"
            >
              <span>View Catalog</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (prod of featuredProducts(); track prod.id) {
              <app-product-card [product]="prod" viewMode="grid"></app-product-card>
            }
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SLIDER -->
      <section class="py-24 bg-cinnamon-100/60 border-t border-cinnamon-200">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <span class="text-xs font-extrabold text-chili-600 uppercase tracking-widest block mb-2">Culinary Reviews</span>
          <h2 class="text-3xl md:text-4xl font-bold text-peppercorn-950 font-display mb-12">Voices of the Kitchen</h2>

          <!-- Testimonial Slider Container -->
          <div class="relative bg-white rounded-3xl shadow-sm border border-cinnamon-200/50 p-8 md:p-14 overflow-hidden">
            
            @if (testimonials().length > 0) {
              <div class="space-y-6">
                <!-- Stars -->
                <div class="flex justify-center gap-1">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <svg class="w-5 h-5 text-saffron-500 fill-saffron-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                </div>

                <!-- Comment -->
                <p class="text-base md:text-xl font-medium text-peppercorn-800 leading-relaxed italic">
                  "{{ testimonials()[activeTestimonialIndex()].comment }}"
                </p>

                <!-- Reviewer -->
                <div class="flex items-center justify-center gap-3 pt-4">
                  <img 
                    [src]="testimonials()[activeTestimonialIndex()].avatar" 
                    [alt]="testimonials()[activeTestimonialIndex()].name" 
                    class="w-11 h-11 object-cover rounded-full ring-2 ring-saffron-500/20"
                  />
                  <div class="text-left">
                    <h4 class="text-sm font-extrabold text-peppercorn-950">{{ testimonials()[activeTestimonialIndex()].name }}</h4>
                    <p class="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{{ testimonials()[activeTestimonialIndex()].role }}</p>
                  </div>
                </div>
              </div>
            }

            <!-- Slider Controls -->
            <div class="flex items-center justify-center gap-4 mt-8">
              <button 
                (click)="prevTestimonial()"
                class="w-10 h-10 rounded-full border border-cinnamon-200 text-peppercorn-600 hover:bg-chili-600 hover:text-white hover:border-chili-600 flex items-center justify-center transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
                </svg>
              </button>
              <div class="flex items-center gap-1.5">
                @for (test of testimonials(); track test.id; let idx = $index) {
                  <button 
                    (click)="setTestimonial(idx)"
                    [class.bg-chili-600]="idx === activeTestimonialIndex()"
                    [class.scale-125]="idx === activeTestimonialIndex()"
                    [class.bg-cinnamon-250]="idx !== activeTestimonialIndex()"
                    class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  ></button>
                }
              </div>
              <button 
                (click)="nextTestimonial()"
                class="w-10 h-10 rounded-full border border-cinnamon-200 text-peppercorn-600 hover:bg-chili-600 hover:text-white hover:border-chili-600 flex items-center justify-center transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- NEWSLETTER BANNER -->
      <section class="relative py-24 bg-chili-900 overflow-hidden text-center text-white">
        <!-- Background organic textures -->
        <div class="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style="background-image: url('/images/spices-hero-bg.png');"></div>
        
        <div class="relative z-10 max-w-xl mx-auto px-4 space-y-6">
          <span class="text-xs font-extrabold text-saffron-400 uppercase tracking-widest block">Harvest Club</span>
          <h2 class="text-3xl md:text-5xl font-bold font-display leading-tight">Taste the Seasons First</h2>
          <p class="text-xs md:text-sm text-chili-100 max-w-md mx-auto leading-relaxed">
            Subscribe to our seasonal harvest drops, private kitchen releases, and 10% off your first single-origin spice package.
          </p>

          @if (newsletterSubmitted()) {
            <div class="p-4 bg-white/10 rounded-2xl border border-white/15 text-sm font-bold text-saffron-300 animate-scale-in">
              ✓ Subscribed! Welcome to the spice circle. Check your inbox for your 10% discount code.
            </div>
          } @else {
            <form (submit)="onNewsletterSubmit($event)" class="flex flex-col sm:flex-row gap-3 pt-2">
              <input 
                type="email" 
                placeholder="Enter your email address"
                required
                class="flex-grow px-5 py-4 rounded-2xl bg-white text-peppercorn-950 font-medium text-sm placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
              <button 
                type="submit" 
                class="px-8 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-bold text-sm rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          }
        </div>
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly mockApi = inject(MockApiService);
  private readonly zone = inject(NgZone);

  protected readonly categories = signal<Category[]>([]);
  protected readonly featuredProducts = signal<Product[]>([]);
  protected readonly testimonials = signal<Testimonial[]>([]);
  
  protected readonly activeTestimonialIndex = signal(0);
  protected readonly newsletterSubmitted = signal(false);

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationFrameId: number | null = null;

  ngOnInit() {
    this.mockApi.getCategories().subscribe(cats => this.categories.set(cats));
    this.mockApi.getFeaturedProducts().subscribe(prods => this.featuredProducts.set(prods));
    this.mockApi.getTestimonials().subscribe(tests => this.testimonials.set(tests));
  }

  ngAfterViewInit() {
    this.initCanvasFlakes();
  }

  private initCanvasFlakes() {
    if (typeof window === 'undefined') return;

    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    interface Flake {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      angle: number;
      spin: number;
      opacity: number;
    }

    const flakes: Flake[] = [];
    const colors = [
      '#e73624', // Chili red
      '#9b1c1c', // Terracotta
      '#d97706', // Saffron gold
      '#653b25', // Cinnamon brown
      '#1e1e1c', // Black pepper
    ];

    const flakeCount = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2, // 2px to 6px particles
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 0.4 - 0.2, // Drift sideways
        speedY: Math.random() * 0.5 + 0.3, // Fall down
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const f of flakes) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.globalAlpha = f.opacity;
        ctx.fillStyle = f.color;

        // Draw particle shape (flakes look irregular, so let's draw diamond/triangle shapes)
        ctx.beginPath();
        ctx.moveTo(0, -f.size);
        ctx.lineTo(f.size, 0);
        ctx.lineTo(0, f.size);
        ctx.lineTo(-f.size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Update positions
        f.y += f.speedY;
        f.x += f.speedX;
        f.angle += f.spin;

        // Reset if bottom reached
        if (f.y > canvas.height) {
          f.y = -10;
          f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width || f.x < 0) {
          f.x = Math.random() * canvas.width;
        }
      }

      this.animationFrameId = requestAnimationFrame(draw);
    };

    this.zone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame(draw);
    });
  }

  prevTestimonial() {
    this.activeTestimonialIndex.update(idx => {
      const total = this.testimonials().length;
      return idx === 0 ? total - 1 : idx - 1;
    });
  }

  nextTestimonial() {
    this.activeTestimonialIndex.update(idx => {
      const total = this.testimonials().length;
      return idx === total - 1 ? 0 : idx + 1;
    });
  }

  setTestimonial(index: number) {
    this.activeTestimonialIndex.set(index);
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    this.newsletterSubmitted.set(true);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
