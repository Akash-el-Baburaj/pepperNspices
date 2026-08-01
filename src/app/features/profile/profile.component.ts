import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockAuthService, User } from '../../core/services/mock-auth.service';
import { MockUserService, Order, Address } from '../../core/services/mock-user.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/mock-data/data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        @if (user(); as currentUser) {
          <!-- HEADER -->
          <div class="mb-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 border-b border-cinnamon-100 pb-6">
            <div class="text-center md:text-left flex items-center gap-4 flex-col md:flex-row">
              <div class="relative group cursor-pointer">
                <img 
                  [src]="currentUser.avatar" 
                  [alt]="currentUser.name" 
                  class="w-20 h-20 rounded-full object-cover ring-4 ring-saffron-500/20"
                />
                <!-- Mock upload banner hover -->
                <div (click)="onMockAvatarUpload()" class="absolute inset-0 bg-peppercorn-950/70 hover:opacity-100 opacity-0 rounded-full flex items-center justify-center text-[10px] text-white font-bold transition-opacity">
                  Edit
                </div>
              </div>
              <div>
                <h1 class="text-3xl font-extrabold font-display text-peppercorn-950">Apothecary Account</h1>
                <p class="text-xs text-peppercorn-500 font-medium">Welcome back, <span class="font-bold text-peppercorn-700">{{ currentUser.name }}</span>.</p>
              </div>
            </div>

            <button 
              (click)="onLogout()" 
              class="px-5 py-2 bg-cinnamon-200 hover:bg-chili-600 hover:text-white rounded-xl text-xs font-bold text-peppercorn-700 transition-all active:scale-95"
            >
              Sign Out
            </button>
          </div>

          <!-- LAYOUT CONTAINER -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT PANEL: TABS NAVIGATION -->
            <nav class="lg:col-span-3 flex flex-row lg:flex-col bg-white border border-cinnamon-100 rounded-2xl p-2 lg:p-4 shadow-xs overflow-x-auto lg:overflow-x-visible gap-1 scrollbar-none w-full select-none">
              @for (tab of tabs; track tab.id) {
                <button 
                  (click)="activeTab.set(tab.id)"
                  [class.bg-chili-50]="activeTab() === tab.id"
                  [class.text-chili-700]="activeTab() === tab.id"
                  [class.font-bold]="activeTab() === tab.id"
                  [class.text-peppercorn-600]="activeTab() !== tab.id"
                  [class.hover:bg-cinnamon-50]="activeTab() !== tab.id"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all whitespace-nowrap lg:w-full"
                >
                  <span class="text-base">{{ tab.icon }}</span>
                  <span>{{ tab.label }}</span>
                </button>
              }
            </nav>

            <!-- RIGHT PANEL: CONTENT PANELS -->
            <div class="lg:col-span-9 bg-white border border-cinnamon-100 rounded-3xl p-6 md:p-8 shadow-xs min-h-[400px]">
              
              <!-- TAB 1: MY PROFILE -->
              @if (activeTab() === 'profile') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex items-center justify-between border-b border-cinnamon-50 pb-2">
                    <h3 class="text-base font-bold font-display text-peppercorn-950">Merchant Profile Details</h3>
                    @if (!isEditingProfile()) {
                      <button (click)="isEditingProfile.set(true)" class="text-xs font-bold text-chili-600 hover:text-chili-700 underline uppercase tracking-wider">Edit</button>
                    }
                  </div>

                  @if (!isEditingProfile()) {
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
                      <div class="space-y-1 p-4 bg-cinnamon-50/30 rounded-xl border border-cinnamon-100">
                        <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Merchant Name</span>
                        <span class="text-peppercorn-900 text-sm font-bold">{{ currentUser.name }}</span>
                      </div>
                      <div class="space-y-1 p-4 bg-cinnamon-50/30 rounded-xl border border-cinnamon-100">
                        <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Email Address</span>
                        <span class="text-peppercorn-900 text-sm font-bold">{{ currentUser.email }}</span>
                      </div>
                      <div class="space-y-1 p-4 bg-cinnamon-50/30 rounded-xl border border-cinnamon-100">
                        <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Contact Phone</span>
                        <span class="text-peppercorn-900 text-sm font-bold">{{ currentUser.phone || 'No phone set' }}</span>
                      </div>
                      <div class="space-y-1 p-4 bg-cinnamon-50/30 rounded-xl border border-cinnamon-100">
                        <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Vault Class</span>
                        <span class="text-saffron-600 text-sm font-bold">⭐ Elite Guild Merchant</span>
                      </div>
                    </div>
                  } @else {
                    <form (submit)="onSaveProfile()" class="space-y-4 text-xs">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Full Name</label>
                        <input type="text" [(ngModel)]="profileForm.name" name="name" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Email Address</label>
                        <input type="email" [(ngModel)]="profileForm.email" name="email" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Phone Number</label>
                        <input type="text" [(ngModel)]="profileForm.phone" name="phone" class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500" />
                      </div>
                      <div class="pt-4 flex gap-3">
                        <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl active:scale-95 transition-all">Save Changes</button>
                        <button type="button" (click)="isEditingProfile.set(false)" class="px-6 py-2.5 bg-cinnamon-100 hover:bg-cinnamon-200 text-peppercorn-700 font-bold rounded-xl active:scale-95 transition-all">Cancel</button>
                      </div>
                    </form>
                  }
                </div>
              }

              <!-- TAB 2: ORDER HISTORY -->
              @if (activeTab() === 'orders') {
                <div class="space-y-6 animate-fade-in">
                  <h3 class="text-base font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Purchase Logs</h3>
                  
                  <div class="space-y-4">
                    @for (order of orders(); track order.id) {
                      <div class="border border-cinnamon-100 rounded-2xl overflow-hidden shadow-2xs">
                        <!-- Summary line click to toggle -->
                        <div 
                          (click)="toggleOrder(order.id)"
                          class="p-4 bg-cinnamon-50/30 hover:bg-cinnamon-50/60 cursor-pointer flex flex-wrap items-center justify-between gap-4 select-none"
                        >
                          <div class="space-y-1 text-xs">
                            <span class="font-extrabold text-peppercorn-900">{{ order.id }}</span>
                            <span class="text-peppercorn-400 block font-medium">Placed on: {{ order.date }}</span>
                          </div>
                          
                          <div class="flex items-center gap-4">
                            <span 
                              [class.bg-emerald-50]="order.status === 'Delivered'"
                              [class.text-emerald-700]="order.status === 'Delivered'"
                              [class.bg-saffron-50]="order.status === 'In Transit'"
                              [class.text-saffron-700]="order.status === 'In Transit'"
                              [class.bg-chili-50]="order.status === 'Processing'"
                              [class.text-chili-700]="order.status === 'Processing'"
                              class="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border"
                            >
                              {{ order.status }}
                            </span>
                            
                            <div class="text-right text-xs">
                              <span class="text-peppercorn-400 block font-medium">Total</span>
                              <span class="font-extrabold text-peppercorn-950">{{ order.total | currency }}</span>
                            </div>
                            
                            <span class="text-peppercorn-400 text-xs font-bold transition-transform" [class.rotate-180]="expandedOrder() === order.id">
                              ▼
                            </span>
                          </div>
                        </div>

                        <!-- Expanded details view -->
                        @if (expandedOrder() === order.id) {
                          <div class="p-5 border-t border-cinnamon-100 bg-white space-y-4 animate-scale-in text-xs">
                            <h4 class="text-[10px] uppercase font-bold text-peppercorn-500 tracking-wider">Crate Shipments</h4>
                            <div class="divide-y divide-cinnamon-100">
                              @for (item of order.items; track item.productId) {
                                <div class="flex items-center justify-between py-2.5">
                                  <div class="flex items-center gap-3">
                                    <img [src]="item.image" [alt]="item.name" class="w-10 h-10 object-cover rounded-lg bg-cinnamon-50" />
                                    <div>
                                      <h5 class="font-bold text-peppercorn-900">{{ item.name }}</h5>
                                      <span class="text-peppercorn-400 text-[10px] font-semibold">Qty: {{ item.quantity }} x {{ item.price | currency }}</span>
                                    </div>
                                  </div>
                                  <span class="font-extrabold text-peppercorn-950">{{ (item.price * item.quantity) | currency }}</span>
                                </div>
                              }
                            </div>

                            <div class="pt-3 border-t border-cinnamon-50 bg-cinnamon-50/20 p-3 rounded-xl">
                              <span class="font-bold text-peppercorn-500 uppercase tracking-widest text-[9px] block">Shipment Destination Address</span>
                              <p class="text-peppercorn-700 font-medium mt-0.5">{{ order.shippingAddress }}</p>
                            </div>
                          </div>
                        }

                      </div>
                    }
                  </div>
                </div>
              }

              <!-- TAB 3: WISHLIST -->
              @if (activeTab() === 'wishlist') {
                <div class="space-y-6 animate-fade-in">
                  <h3 class="text-base font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Saved Harvests</h3>
                  
                  @if (wishlist().length === 0) {
                    <div class="text-center py-12 text-peppercorn-500 space-y-2">
                      <span class="text-4xl block">✨</span>
                      <h4 class="text-sm font-bold text-peppercorn-900">Wishlist is Empty</h4>
                      <p class="text-xs text-peppercorn-400 max-w-xs mx-auto">Click the heart details on product grids to stack your saved spice shelf.</p>
                    </div>
                  } @else {
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      @for (prod of wishlist(); track prod.id) {
                        <div class="flex items-center gap-4 p-4 border border-cinnamon-100 rounded-2xl shadow-2xs relative">
                          <img [src]="prod.images[0]" [alt]="prod.name" class="w-16 h-16 object-cover rounded-xl bg-cinnamon-50" />
                          <div class="flex-grow min-w-0 text-xs">
                            <h4 [routerLink]="['/product', prod.id]" class="font-bold text-peppercorn-950 hover:text-chili-600 transition-colors cursor-pointer truncate">{{ prod.name }}</h4>
                            <span class="text-peppercorn-400 block font-medium">Origin: {{ prod.origin }}</span>
                            <span class="text-sm font-extrabold text-peppercorn-900 block mt-1">{{ prod.price | currency }}</span>
                          </div>
                          
                          <div class="flex flex-col gap-2">
                            <button 
                              (click)="onAddWishlistItemToCart(prod)"
                              class="p-2 bg-chili-600 hover:bg-chili-500 text-white rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95"
                              title="Add to Crate"
                            >
                              🛒
                            </button>
                            <button 
                              (click)="onRemoveWishlist(prod)"
                              class="p-2 bg-cinnamon-100 hover:bg-chili-50 text-peppercorn-600 hover:text-chili-600 rounded-xl transition-colors"
                              title="Remove"
                            >
                              ❌
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- TAB 4: SAVED ADDRESSES -->
              @if (activeTab() === 'addresses') {
                <div class="space-y-6 animate-fade-in">
                  <div class="flex items-center justify-between border-b border-cinnamon-50 pb-2">
                    <h3 class="text-base font-bold font-display text-peppercorn-950">Shipment Vault Addresses</h3>
                    @if (!isAddingAddress()) {
                      <button (click)="isAddingAddress.set(true)" class="text-xs font-bold text-chili-600 hover:text-chili-700 underline uppercase tracking-wider">Add Address</button>
                    }
                  </div>

                  <!-- New Address Form -->
                  @if (isAddingAddress()) {
                    <form (submit)="onSaveAddress()" class="space-y-4 text-xs">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Label (e.g. Home, Office)</label>
                        <input type="text" [(ngModel)]="addressForm.label" name="label" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500" />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold text-peppercorn-500 uppercase">First Name</label>
                          <input type="text" [(ngModel)]="addressForm.firstName" name="firstName" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none" />
                        </div>
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Last Name</label>
                          <input type="text" [(ngModel)]="addressForm.lastName" name="lastName" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none" />
                        </div>
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Street Address</label>
                        <input type="text" [(ngModel)]="addressForm.address" name="address" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none" />
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold text-peppercorn-500 uppercase">City</label>
                          <input type="text" [(ngModel)]="addressForm.city" name="city" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none" />
                        </div>
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold text-peppercorn-500 uppercase">ZIP / Postal Code</label>
                          <input type="text" [(ngModel)]="addressForm.zip" name="zip" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none" />
                        </div>
                        <div class="space-y-1">
                          <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Country</label>
                          <input type="text" [(ngModel)]="addressForm.country" name="country" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl" />
                        </div>
                      </div>
                      <div class="pt-4 flex gap-3">
                        <button type="submit" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl active:scale-95 transition-all">Add Address</button>
                        <button type="button" (click)="isAddingAddress.set(false)" class="px-6 py-2.5 bg-cinnamon-100 hover:bg-cinnamon-200 text-peppercorn-700 font-bold rounded-xl active:scale-95 transition-all">Cancel</button>
                      </div>
                    </form>
                  } @else {
                    <!-- Address List Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      @for (addr of addresses(); track addr.id) {
                        <div class="p-4 border border-cinnamon-100 rounded-2xl bg-cinnamon-50/20 text-xs font-semibold flex flex-col justify-between min-h-[140px]">
                          <div class="space-y-1">
                            <span class="text-[10px] text-chili-600 uppercase font-bold tracking-widest">{{ addr.label }}</span>
                            <h4 class="text-peppercorn-900 font-bold pt-1">{{ addr.firstName }} {{ addr.lastName }}</h4>
                            <p class="text-peppercorn-600 leading-normal">{{ addr.address }}</p>
                            <p class="text-peppercorn-600 leading-normal">{{ addr.city }}, {{ addr.zip }}</p>
                            <p class="text-peppercorn-600 leading-normal">{{ addr.country }}</p>
                          </div>
                          
                          <div class="pt-3 border-t border-cinnamon-50/60 mt-4 flex justify-end">
                            <button 
                              (click)="onRemoveAddress(addr.id)"
                              class="text-[10px] font-bold text-chili-600 hover:text-chili-850 uppercase tracking-widest"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- TAB 5: ACCOUNT SETTINGS -->
              @if (activeTab() === 'settings') {
                <div class="space-y-8 animate-fade-in text-xs font-semibold">
                  
                  <!-- Change Password -->
                  <div class="space-y-4">
                    <h3 class="text-base font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Change Password</h3>
                    <form (submit)="onChangePassword($event)" class="space-y-4 max-w-sm">
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Current Password</label>
                        <input type="password" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl" />
                      </div>
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-peppercorn-500 uppercase">New Password</label>
                        <input type="password" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl" />
                      </div>
                      <button type="submit" class="px-6 py-2.5 bg-chili-600 hover:bg-chili-500 text-white font-bold rounded-xl active:scale-95 transition-all">Update Password</button>
                    </form>
                  </div>

                  <!-- Toggles -->
                  <div class="space-y-4 pt-4 border-t border-cinnamon-50">
                    <h3 class="text-base font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Apothecary Notifications</h3>
                    
                    <div class="space-y-3">
                      <div class="flex items-center justify-between py-2 border-b border-cinnamon-50">
                        <div>
                          <h4 class="text-xs font-bold text-peppercorn-900">Seasonal Harvest Drops</h4>
                          <p class="text-[10px] text-peppercorn-500 font-medium">Alert me immediately when raw spice cargos land in the warehouse vaults.</p>
                        </div>
                        <input type="checkbox" checked class="w-4 h-4 text-chili-600 border-cinnamon-300 focus:ring-chili-500/20" />
                      </div>
                      
                      <div class="flex items-center justify-between py-2 border-b border-cinnamon-50">
                        <div>
                          <h4 class="text-xs font-bold text-peppercorn-900">Recipe & Sourcing Dispatch</h4>
                          <p class="text-[10px] text-peppercorn-500 font-medium">Monthly kitchen tutorials, chef spotlights, and agricultural farm stories.</p>
                        </div>
                        <input type="checkbox" checked class="w-4 h-4 text-chili-600 border-cinnamon-300 focus:ring-chili-500/20" />
                      </div>
                      
                      <div class="flex items-center justify-between py-2">
                        <div>
                          <h4 class="text-xs font-bold text-peppercorn-900">Private Merchant Offers</h4>
                          <p class="text-[10px] text-peppercorn-500 font-medium">Discounts, vault clearances, and collector cabinet reservations.</p>
                        </div>
                        <input type="checkbox" class="w-4 h-4 text-chili-600 border-cinnamon-300 focus:ring-chili-500/20" />
                      </div>
                    </div>
                  </div>

                </div>
              }

            </div>

          </div>
        }

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(MockAuthService);
  private readonly userService = inject(MockUserService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  // Gated user signal reference
  protected readonly user = this.authService.currentUser;
  
  // Navigation tabs state
  protected readonly activeTab = signal<string>('profile');

  // Computed data references
  protected readonly orders = this.userService.orders;
  protected readonly addresses = this.userService.addresses;
  protected readonly wishlist = this.userService.wishlist;

  // Expanding states
  protected readonly expandedOrder = signal<string | null>(null);
  protected readonly isEditingProfile = signal<boolean>(false);
  protected readonly isAddingAddress = signal<boolean>(false);

  // Tabs layout meta
  protected readonly tabs = [
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'orders', label: 'Order History', icon: '📦' },
    { id: 'wishlist', label: 'Wishlist Shelf', icon: '✨' },
    { id: 'addresses', label: 'Saved Addresses', icon: '🏠' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' }
  ];

  // Forms bound state variables
  protected profileForm = { name: '', email: '', phone: '' };
  protected addressForm = { label: '', firstName: '', lastName: '', address: '', city: '', zip: '', country: '' };

  ngOnInit() {
    // Auth gate check
    const currentUser = this.user();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Populate profile edit form defaults
    this.profileForm = {
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone
    };
  }

  toggleOrder(id: string) {
    this.expandedOrder.update(curr => curr === id ? null : id);
  }

  onSaveProfile() {
    const currentUser = this.user();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: this.profileForm.name,
        email: this.profileForm.email,
        phone: this.profileForm.phone
      };
      
      this.authService.currentUser.set(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('spice_mock_user', JSON.stringify(updatedUser));
      }
      this.isEditingProfile.set(false);
    }
  }

  onMockAvatarUpload() {
    // Cycle mock photo avatars
    const avatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
    ];
    const curr = this.user();
    if (curr) {
      const nextIndex = (avatars.indexOf(curr.avatar) + 1) % avatars.length;
      const updatedUser: User = {
        ...curr,
        avatar: avatars[nextIndex]
      };
      this.authService.currentUser.set(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('spice_mock_user', JSON.stringify(updatedUser));
      }
    }
  }

  onSaveAddress() {
    if (
      !this.addressForm.label ||
      !this.addressForm.firstName ||
      !this.addressForm.lastName ||
      !this.addressForm.address ||
      !this.addressForm.city ||
      !this.addressForm.zip ||
      !this.addressForm.country
    ) {
      return;
    }

    this.userService.addAddress({ ...this.addressForm });
    
    // Clear address form
    this.addressForm = { label: '', firstName: '', lastName: '', address: '', city: '', zip: '', country: '' };
    this.isAddingAddress.set(false);
  }

  onRemoveAddress(id: string) {
    this.userService.deleteAddress(id);
  }

  onRemoveWishlist(product: Product) {
    this.userService.toggleWishlist(product);
  }

  onAddWishlistItemToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    alert(`Added ${product.name} package into crate!`);
  }

  onChangePassword(event: Event) {
    event.preventDefault();
    alert('Mock: Password changed successfully.');
    const form = event.target as HTMLFormElement;
    form.reset();
  }

  onLogout() {
    this.authService.logout();
  }
}
