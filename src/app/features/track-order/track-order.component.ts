import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockUserService, Order } from '../../core/services/mock-user.service';
import { OrderTrackerComponent } from '../../shared/components/order-tracker.component';
import { ActivityTrackingService } from '../../core/services/activity-tracking.service';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderTrackerComponent],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- BREADCRUMBS -->
        <nav class="flex text-xs font-semibold uppercase tracking-widest text-peppercorn-400 gap-2 mb-8 select-none">
          <a routerLink="/" class="hover:text-chili-600 transition-colors">Home</a>
          <span>/</span>
          <a routerLink="/profile" class="hover:text-chili-600 transition-colors">Profile</a>
          <span>/</span>
          <span class="text-peppercorn-900 truncate">Track Order</span>
        </nav>

        <div class="bg-white border border-cinnamon-100 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          
          @if (order(); as o) {
            <!-- Header status title -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cinnamon-50 pb-4 gap-3">
              <div>
                <h1 class="text-2xl font-extrabold font-display text-peppercorn-950">Cargo Tracking</h1>
                <p class="text-xs text-peppercorn-500 font-medium">Order ID: <span class="font-bold text-peppercorn-700">{{ o.id }}</span> | Placed on: {{ o.date }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-peppercorn-400 font-bold uppercase tracking-wider">Status:</span>
                <span 
                  [class.bg-emerald-50]="o.status === 'Delivered'"
                  [class.text-emerald-700]="o.status === 'Delivered'"
                  [class.bg-saffron-50]="o.status === 'Shipped' || o.status === 'Out for Delivery'"
                  [class.text-saffron-700]="o.status === 'Shipped' || o.status === 'Out for Delivery'"
                  [class.bg-chili-50]="o.status === 'Placed' || o.status === 'Processing' || o.status === 'Packed'"
                  [class.text-chili-700]="o.status === 'Placed' || o.status === 'Processing' || o.status === 'Packed'"
                  [class.bg-red-50]="o.status === 'Cancelled'"
                  [class.text-red-700]="o.status === 'Cancelled'"
                  class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border"
                >
                  {{ o.status }}
                </span>
              </div>
            </div>

            <!-- Tracker component inclusion -->
            <app-order-tracker [order]="o"></app-order-tracker>

            <!-- Order items list inside tracking summary -->
            <div class="border-t border-cinnamon-100 pt-6 space-y-4">
              <h3 class="text-xs font-bold uppercase text-peppercorn-400 tracking-wider">Crate Cargo Summary</h3>
              <div class="divide-y divide-cinnamon-50 border border-cinnamon-100 rounded-2xl p-4">
                @for (item of o.items; track item.productId) {
                  <div class="flex items-center justify-between py-2 text-xs font-semibold">
                    <div class="flex items-center gap-3">
                      <img [src]="item.image" [alt]="item.name" class="w-8 h-8 object-cover rounded-lg bg-cinnamon-50" />
                      <div>
                        <h4 class="text-peppercorn-900 font-bold">{{ item.name }}</h4>
                        <span class="text-peppercorn-400 text-[10px] font-bold">Qty: {{ item.quantity }} x {{ item.price | currency }}</span>
                      </div>
                    </div>
                    <span class="text-peppercorn-950 font-extrabold">{{ (item.price * item.quantity) | currency }}</span>
                  </div>
                }
                <div class="flex justify-between border-t border-cinnamon-50 pt-2 text-xs font-bold text-peppercorn-950">
                  <span>Grand Total Paid</span>
                  <span class="text-sm font-extrabold">{{ o.total | currency }}</span>
                </div>
              </div>
            </div>
          } @else {
            <!-- Empty/Error State -->
            <div class="text-center py-12 text-peppercorn-500 space-y-3">
              <span class="text-4xl block">🔍</span>
              <h2 class="text-lg font-bold text-peppercorn-950">Cargo Order Not Located</h2>
              <p class="text-xs text-peppercorn-450 max-w-sm mx-auto">We couldn't retrieve a mock order matching the tracking ID provided. It may not exist or has been archived.</p>
              <div class="pt-4">
                <a 
                  routerLink="/profile" 
                  class="px-6 py-2.5 bg-chili-600 hover:bg-chili-500 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Return to Account
                </a>
              </div>
            </div>
          }

        </div>

      </div>
    </div>
  `
})
export class TrackOrderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(MockUserService);
  private readonly activityService = inject(ActivityTrackingService);

  protected readonly orderId = signal<string | null>(null);

  // Compute matching order from orders list signal
  protected readonly order = computed(() => {
    const id = this.orderId();
    if (!id) return null;
    return this.userService.orders().find(o => o.id === id) || null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('orderId');
      this.orderId.set(id);

      if (id) {
        this.activityService.track(
          'VIEW_ORDER_TRACKING',
          `Viewed order tracking status page for ${id}`,
          { orderId: id }
        );
      }
    });
  }
}
