import { Component, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockUserService, Order } from '../../core/services/mock-user.service';
import { ActivityTrackingService } from '../../core/services/activity-tracking.service';

@Component({
  selector: 'app-order-tracker',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 text-xs text-peppercorn-800">
      
      <!-- TOP INFO: Estimated delivery & Courier details -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cinnamon-50/40 p-4 border border-cinnamon-100 rounded-2xl">
        <div>
          <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Estimated Delivery</span>
          <span class="text-peppercorn-900 font-bold text-sm">{{ order().estimatedDelivery || 'Pending' }}</span>
        </div>
        <div>
          <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Courier Partner</span>
          <span class="text-peppercorn-900 font-bold text-sm">{{ order().courier || 'Sasya Carrier' }}</span>
        </div>
        <div>
          <span class="text-[9px] uppercase tracking-wider text-peppercorn-400 font-bold block">Tracking ID</span>
          <span class="text-peppercorn-900 font-mono font-bold text-sm">{{ order().trackingNumber || 'Pending' }}</span>
        </div>
      </div>

      <!-- VISUAL STEPPER CONTROLLER -->
      <div>
        <!-- Desktop Stepper (Horizontal) -->
        <div class="hidden md:flex items-center justify-between relative py-6 px-4">
          <!-- Connector line background -->
          <div class="absolute top-[2.4rem] left-[4rem] right-[4rem] h-1 bg-cinnamon-100 -z-10"></div>
          <!-- Green progress connector line -->
          <div 
            class="absolute top-[2.4rem] left-[4rem] h-1 bg-emerald-600 transition-all duration-500 -z-10"
            [style.width.%]="progressPercentage"
          ></div>

          @for (stage of STAGES; track stage; let idx = $index) {
            <div class="flex flex-col items-center text-center flex-1 relative">
              <!-- Step Node -->
              <div 
                [class.bg-emerald-600]="idx < order().currentStep"
                [class.border-emerald-600]="idx < order().currentStep"
                [class.text-white]="idx < order().currentStep"
                [class.bg-emerald-500]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.border-emerald-500]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.text-white]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.animate-pulse]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.bg-red-500]="order().status === 'Cancelled' && idx === order().currentStep"
                [class.border-red-500]="order().status === 'Cancelled' && idx === order().currentStep"
                [class.bg-cinnamon-50]="idx > order().currentStep"
                [class.border-cinnamon-200]="idx > order().currentStep"
                [class.text-peppercorn-400]="idx > order().currentStep"
                class="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-xs transition-all duration-300 z-10"
              >
                @if (idx < order().currentStep) {
                  ✓
                } @else if (order().status === 'Cancelled' && idx === order().currentStep) {
                  ✕
                } @else {
                  {{ idx + 1 }}
                }
              </div>

              <!-- Step Label -->
              <span 
                [class.text-emerald-700]="idx < order().currentStep"
                [class.text-emerald-950]="idx === order().currentStep"
                [class.font-bold]="idx === order().currentStep"
                [class.text-peppercorn-400]="idx > order().currentStep"
                class="text-[10px] font-bold uppercase tracking-wider mt-3 whitespace-nowrap"
              >
                {{ stage }}
              </span>
            </div>
          }
        </div>

        <!-- Mobile Stepper (Vertical Timeline) -->
        <div class="md:hidden flex flex-col space-y-6 relative pl-6 py-4">
          <!-- Vertical line connector -->
          <div class="absolute left-[1.15rem] top-8 bottom-8 w-0.5 bg-cinnamon-100 -z-10"></div>
          <!-- Completed vertical progress connector -->
          <div 
            class="absolute left-[1.15rem] top-8 w-0.5 bg-emerald-600 transition-all duration-500 -z-10"
            [style.height.%]="progressPercentage"
          ></div>

          @for (stage of STAGES; track stage; let idx = $index) {
            <div class="flex items-center gap-4 relative">
              <!-- Step Node -->
              <div 
                [class.bg-emerald-600]="idx < order().currentStep"
                [class.border-emerald-600]="idx < order().currentStep"
                [class.text-white]="idx < order().currentStep"
                [class.bg-emerald-500]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.border-emerald-500]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.text-white]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.animate-pulse]="idx === order().currentStep && order().status !== 'Cancelled'"
                [class.bg-red-500]="order().status === 'Cancelled' && idx === order().currentStep"
                [class.border-red-500]="order().status === 'Cancelled' && idx === order().currentStep"
                [class.bg-cinnamon-50]="idx > order().currentStep"
                [class.border-cinnamon-200]="idx > order().currentStep"
                [class.text-peppercorn-400]="idx > order().currentStep"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-xs transition-all duration-300 z-10 flex-shrink-0"
              >
                @if (idx < order().currentStep) {
                  ✓
                } @else if (order().status === 'Cancelled' && idx === order().currentStep) {
                  ✕
                } @else {
                  {{ idx + 1 }}
                }
              </div>

              <!-- Step Label & Description -->
              <div class="flex flex-col">
                <span 
                  [class.text-emerald-700]="idx < order().currentStep"
                  [class.text-emerald-950]="idx === order().currentStep"
                  [class.font-bold]="idx === order().currentStep"
                  [class.text-peppercorn-400]="idx > order().currentStep"
                  class="text-[10px] font-bold uppercase tracking-widest"
                >
                  {{ stage }}
                </span>
                <span class="text-[9px] text-peppercorn-400">
                  @if (idx === order().currentStep) {
                    Current Status: {{ order().status }}
                  } @else if (idx < order().currentStep) {
                    Stage completed
                  } @else {
                    Pending transit
                  }
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- DETAILED TIMELINE LOGS -->
      <div class="border-t border-cinnamon-100 pt-4 space-y-3">
        <h4 class="text-[10px] uppercase font-bold text-peppercorn-500 tracking-wider">Transit Activity Logs</h4>
        
        <div class="space-y-3 pl-3">
          @for (log of order().history; track log.timestamp) {
            <div class="flex items-start gap-3 text-xs leading-normal">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
              <div class="flex-grow">
                <div class="flex flex-wrap items-baseline gap-2">
                  <span class="font-extrabold text-peppercorn-900 capitalize">{{ log.status.replace('-', ' ') }}</span>
                  <span class="text-[9px] text-peppercorn-400 font-bold">{{ log.timestamp | date:'MMM d, y, h:mm a' }}</span>
                </div>
                <p class="text-peppercorn-600 font-medium text-[11px] mt-0.5">{{ log.note }}</p>
              </div>
            </div>
          } @empty {
            <p class="text-peppercorn-400 text-xs italic">No activity logs recorded yet.</p>
          }
        </div>
      </div>

      <!-- DEVELOPER SIMULATOR ACTIONS -->
      @if (order().status !== 'Delivered' && order().status !== 'Cancelled') {
        <div class="pt-4 border-t border-cinnamon-50 bg-amber-50/50 p-4 border border-amber-200/50 rounded-2xl flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-2">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span class="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Dev Simulation Portal</span>
          </div>
          <button 
            (click)="onAdvanceStatus()"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-xs transition-transform active:scale-95 hover:scale-102"
          >
            Advance Status ➔
          </button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class OrderTrackerComponent {
  private readonly userService = inject(MockUserService);
  private readonly activityService = inject(ActivityTrackingService);

  readonly order = input.required<Order>();

  protected readonly STAGES: Order['status'][] = ['Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Calculate connector progress line width based on active step
  get progressPercentage(): number {
    const totalStages = this.STAGES.length - 1;
    return (this.order().currentStep / totalStages) * 100;
  }

  onAdvanceStatus() {
    const nextStep = this.order().currentStep + 1;
    if (nextStep < this.STAGES.length) {
      const nextStatus = this.STAGES[nextStep];
      this.userService.advanceOrderStatus(this.order().id);
      this.activityService.track(
        'SIMULATE_ORDER_STATUS',
        `Dev: Advanced status of order ${this.order().id} to ${nextStatus}`,
        { orderId: this.order().id, nextStatus }
      );
    }
  }
}
