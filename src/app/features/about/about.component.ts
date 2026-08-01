import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';

interface MapPin {
  id: string;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  spice: string;
  details: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, ParallaxDirective, TiltDirective],
  template: `
    <div class="relative w-full overflow-hidden bg-sage-50">
      
      <!-- HERO PARALLAX HEADER -->
      <section class="relative h-[60vh] flex items-center justify-center overflow-hidden bg-moss-950">
        <div 
          [appParallax]="-0.25"
          class="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center opacity-30 mix-blend-normal"
          style="background-image: url('/images/spices-herbs-hero-bg.png');"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-sage-50 via-moss-950/40 to-moss-950/20"></div>

        <div class="relative z-20 text-center space-y-4 max-w-3xl mx-auto px-4 mt-12">
          <span class="text-xs font-extrabold text-saffron-400 uppercase tracking-widest block">Our Roots</span>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight font-display tracking-tight">
            Crafting Taste <br class="hidden md:inline"/>
            Across Latitudes
          </h1>
          <div class="w-12 h-1 bg-moss-500 mx-auto rounded-full"></div>
        </div>
      </section>

      <!-- FARM-TO-TABLE JOURNEY -->
      <section class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-xl mx-auto mb-20">
          <span class="text-xs font-extrabold text-moss-700 uppercase tracking-widest">Our Method</span>
          <h2 class="text-3xl md:text-4xl font-bold text-peppercorn-950 font-display mt-2">The Farm-To-Table Path</h2>
          <p class="text-xs text-peppercorn-500 mt-2 font-medium">How we preserve the volatile oils, coloring properties, and tasting complexities.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Connective background line -->
          <div class="hidden md:block absolute top-[28%] left-[10%] right-[10%] h-0.5 bg-sage-200 z-0"></div>

          <!-- Step 1 -->
          <div [appTilt]="4" [scale]="1.01" class="relative z-10 text-center space-y-4 group border-torn-card bg-sage-50/70 hover:bg-sage-100/50 border border-sage-200/60 p-6 shadow-xs transition-all">
            <span class="w-14 h-14 mx-auto border-torn bg-white border border-sage-200 flex items-center justify-center text-xl shadow-xs group-hover:bg-moss-600 group-hover:text-white transition-all duration-300">
              👩‍🌾
            </span>
            <span class="text-[10px] font-extrabold text-moss-700 uppercase tracking-widest block">Phase 01</span>
            <h3 class="text-lg font-bold text-peppercorn-950 font-display">Ethical Cultivation</h3>
            <p class="text-xs text-peppercorn-600 leading-relaxed font-medium">
              We partner directly with family estates. Spices are organically grown without artificial inputs and harvested by hand at full physiological maturity.
            </p>
          </div>

          <!-- Step 2 -->
          <div [appTilt]="4" [scale]="1.01" class="relative z-10 text-center space-y-4 group border-torn-card bg-sage-50/70 hover:bg-sage-100/50 border border-sage-200/60 p-6 shadow-xs transition-all">
            <span class="w-14 h-14 mx-auto border-torn bg-white border border-sage-200 flex items-center justify-center text-xl shadow-xs group-hover:bg-moss-600 group-hover:text-white transition-all duration-300">
              ☀️
            </span>
            <span class="text-[10px] font-extrabold text-moss-700 uppercase tracking-widest block">Phase 02</span>
            <h3 class="text-lg font-bold text-peppercorn-950 font-display">Gentle Curing</h3>
            <p class="text-xs text-peppercorn-600 leading-relaxed font-medium">
              Instead of high-heat industrial ovens that destroy essential flavors, our spices are dried in shading beds or sun-cured naturally to lock in character.
            </p>
          </div>

          <!-- Step 3 -->
          <div [appTilt]="4" [scale]="1.01" class="relative z-10 text-center space-y-4 group border-torn-card bg-sage-50/70 hover:bg-sage-100/50 border border-sage-200/60 p-6 shadow-xs transition-all">
            <span class="w-14 h-14 mx-auto border-torn bg-white border border-sage-200 flex items-center justify-center text-xl shadow-xs group-hover:bg-moss-600 group-hover:text-white transition-all duration-300">
              🏺
            </span>
            <span class="text-[10px] font-extrabold text-moss-700 uppercase tracking-widest block">Phase 03</span>
            <h3 class="text-lg font-bold text-peppercorn-950 font-display">Batch Stone-Grinding</h3>
            <p class="text-xs text-peppercorn-600 leading-relaxed font-medium">
              We stone-grind in small batches weekly and pack immediately in glass. Minimizing friction heat keeps delicate spice essences completely intact.
            </p>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE MAP SECTION -->
      <section class="py-24 bg-moss-950 text-white border-y border-moss-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-xl mx-auto mb-16">
            <span class="text-xs font-extrabold text-saffron-400 uppercase tracking-widest">Sourcing Origin</span>
            <h2 class="text-3xl md:text-4xl font-bold font-display text-white mt-2">World Spice Mapping</h2>
            <p class="text-xs text-gray-400 mt-2 font-medium">Select a location marker on the global map below to inspect our single-origin crop details.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left map graphic column -->
            <div class="lg:col-span-8 relative aspect-[16/9] w-full bg-moss-900/60 border border-moss-800 rounded-3xl overflow-hidden shadow-2xl p-6 select-none">
              <!-- World map vector line background placeholder using CSS stylized paths -->
              <div class="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200');"></div>
              
              <!-- Draw stylized map grid lines -->
              <div class="absolute inset-0 flex flex-col justify-between p-12 opacity-10 pointer-events-none text-[8px] font-mono text-white">
                <div class="flex justify-between"><span>LAT 60° N</span><span>LAT 60° N</span></div>
                <div class="flex justify-between"><span>LAT 0° (EQUATOR)</span><span>LAT 0° (EQUATOR)</span></div>
                <div class="flex justify-between"><span>LAT 60° S</span><span>LAT 60° S</span></div>
              </div>

              <!-- Map pins loop -->
              @for (pin of mapPins; track pin.id) {
                <button 
                  (click)="activePin.set(pin)"
                  [style.left.%]="pin.x"
                  [style.top.%]="pin.y"
                  [class.scale-125]="activePin().id === pin.id"
                  [class.bg-saffron-500]="activePin().id === pin.id"
                  [class.bg-moss-500]="activePin().id !== pin.id"
                  class="absolute w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white border-2 border-moss-950 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-300 hover:bg-saffron-500"
                >
                  📍
                </button>
              }
            </div>

            <!-- Right card info panel -->
            <div class="lg:col-span-4 bg-moss-900/60 border border-moss-800 p-8 rounded-3xl shadow-xl space-y-4 animate-scale-in">
              <span class="text-[10px] font-extrabold text-saffron-400 uppercase tracking-widest">Active Marker</span>
              <h3 class="text-2xl font-bold font-display text-white mt-1">{{ activePin().name }}</h3>
              <div class="w-12 h-0.5 bg-saffron-500 rounded-full"></div>
              
              <div class="space-y-1 text-xs">
                <span class="font-extrabold text-gray-400 uppercase block text-[10px]">Harvest Crop Sourced</span>
                <span class="font-bold text-white text-sm">{{ activePin().spice }}</span>
              </div>

              <p class="text-xs text-gray-300 leading-relaxed font-medium pt-2">
                {{ activePin().details }}
              </p>

              <div class="pt-4 border-t border-white/5">
                <a 
                  routerLink="/shop"
                  class="inline-block w-full text-center py-3 bg-gradient-to-r from-moss-700 to-moss-600 hover:from-saffron-600 hover:to-saffron-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-103"
                >
                  View Origin Catalog
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ETHICS & STANDARDS -->
      <section class="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 class="text-3xl font-bold font-display text-peppercorn-950">A Clean Commitment</h2>
        <div class="w-12 h-1 bg-saffron-500 mx-auto rounded-full"></div>
        <p class="text-sm text-peppercorn-600 leading-relaxed max-w-2xl mx-auto font-medium">
          Sasya was built on a simple premise: spices are the soul of cooking, and their purity should be protected. We reject irradiated warehouse stocks, chemical color enhancements, and exploitative supply chains. Every jar in our collection represents a direct, respectful link between grower and chef.
        </p>
        <div class="flex items-center justify-center gap-8 pt-4 flex-wrap select-none">
          <span class="text-xs font-bold text-peppercorn-500 uppercase tracking-widest bg-white border border-cinnamon-100 rounded-xl px-4 py-2">✓ No GMO Pods</span>
          <span class="text-xs font-bold text-peppercorn-500 uppercase tracking-widest bg-white border border-cinnamon-100 rounded-xl px-4 py-2">✓ Batch Lab Tested</span>
          <span class="text-xs font-bold text-peppercorn-500 uppercase tracking-widest bg-white border border-cinnamon-100 rounded-xl px-4 py-2">✓ Direct Trade Certified</span>
        </div>
      </section>

    </div>
  `
})
export class AboutComponent {
  protected readonly mapPins: MapPin[] = [
    {
      id: 'pin_1',
      name: 'Kampot Region, Cambodia',
      x: 72,
      y: 52,
      spice: 'Kampot Peppercorns',
      details: 'Grown on small slopes facing the Gulf of Thailand. Salt breezes, quartz-rich soils, and generations of expert organic knowledge yield pepper with delicate notes of flower, pine, and citrus.'
    },
    {
      id: 'pin_2',
      name: 'Malabar Forest, Kerala, India',
      x: 64,
      y: 48,
      spice: 'Tellicherry Black Pepper',
      details: 'The historic birthland of black pepper. Sourced from wild vines where extra-large berries are left on the vine to ripen fully, creating deep, sweet, raisin-like undertones.'
    },
    {
      id: 'pin_3',
      name: 'Herat Province, Afghanistan',
      x: 58,
      y: 35,
      spice: 'Super Negin Saffron',
      details: 'Plucked by hand from fields near the Hari River. Super Negin grade saffron of intense saffronin concentrations, offering warm honey aromas and a gorgeous gold dye.'
    },
    {
      id: 'pin_4',
      name: 'Sava Region, Madagascar',
      x: 54,
      y: 72,
      spice: 'Bourbon Vanilla Beans',
      details: 'Madagascar vanilla beans cured over several months, cold-smoked over old oak barrels to introduce sweet, woody, and complex caramelized layers.'
    },
    {
      id: 'pin_5',
      name: 'Aleppo, Syrian Border',
      x: 48,
      y: 32,
      spice: 'Aleppo Pepper Flakes',
      details: 'Sun-dried partially, seedless pepper flakes, cured with a touch of cotton-seed oil and sea salt. It delivers a raisin-like sweetness, tang, and mild background warmth.'
    }
  ];

  // Default to Cambodia pin
  protected readonly activePin = signal<MapPin>(this.mapPins[0]);
}
