import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- HEADER STEP INDICATOR -->
        @if (currentStep() < 4) {
          <div class="mb-10 text-center">
            <h1 class="text-3xl font-extrabold font-display text-peppercorn-950">Haldi & Horn Checkout</h1>
            
            <!-- Step Indicators -->
            <div class="flex items-center justify-center gap-4 mt-6 max-w-md mx-auto select-none">
              @for (step of [1, 2, 3]; track step) {
                <div class="flex items-center gap-2">
                  <span 
                    [class.bg-chili-600]="currentStep() === step"
                    [class.text-white]="currentStep() === step"
                    [class.bg-emerald-600]="currentStep() > step"
                    [class.text-white]="currentStep() > step"
                    [class.bg-cinnamon-200]="currentStep() < step"
                    [class.text-peppercorn-600]="currentStep() < step"
                    class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300"
                  >
                    @if (currentStep() > step) {
                      ✓
                    } @else {
                      {{ step }}
                    }
                  </span>
                  <span 
                    [class.text-peppercorn-950]="currentStep() === step"
                    [class.font-bold]="currentStep() === step"
                    [class.text-peppercorn-400]="currentStep() !== step"
                    class="text-xs uppercase tracking-wider font-semibold"
                  >
                    {{ step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review' }}
                  </span>
                  @if (step < 3) {
                    <span class="text-peppercorn-300">/</span>
                  }
                </div>
              }
            </div>
          </div>
        }

        <!-- WIZARD SCREENS -->
        <div class="bg-white border border-cinnamon-100 rounded-3xl p-6 md:p-10 shadow-sm">
          
          <!-- STEP 1: SHIPPING INFORMATION -->
          @if (currentStep() === 1) {
            <form (submit)="nextStep()" class="space-y-6">
              <h3 class="text-lg font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Shipping Destination</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">First Name</label>
                  <input type="text" [(ngModel)]="shippingData.firstName" name="firstName" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Last Name</label>
                  <input type="text" [(ngModel)]="shippingData.lastName" name="lastName" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Email Address</label>
                <input type="email" [(ngModel)]="shippingData.email" name="email" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Street Address</label>
                <input type="text" [(ngModel)]="shippingData.address" name="address" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">City</label>
                  <input type="text" [(ngModel)]="shippingData.city" name="city" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">ZIP / Postal Code</label>
                  <input type="text" [(ngModel)]="shippingData.zip" name="zip" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Country</label>
                  <input type="text" [(ngModel)]="shippingData.country" name="country" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
              </div>

              <div class="pt-4 flex justify-between">
                <a routerLink="/cart" class="px-6 py-3 bg-cinnamon-100 hover:bg-cinnamon-250 text-peppercorn-700 text-xs font-extrabold rounded-xl transition-all">Back to Cart</a>
                <button type="submit" [disabled]="!isShippingValid()" class="px-8 py-3 bg-chili-600 hover:bg-chili-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:scale-103 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed">Continue to Payment</button>
              </div>
            </form>
          }

          <!-- STEP 2: MOCK PAYMENT DETAILS -->
          @if (currentStep() === 2) {
            <form (submit)="nextStep()" class="space-y-6">
              <h3 class="text-lg font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Secure Payment Vault</h3>
              
              <div class="p-4 bg-saffron-50 border border-saffron-200 rounded-2xl text-[11px] text-saffron-800 leading-relaxed font-semibold">
                🔒 MOCK INTEGRATION: This checkout screen operates entirely in sandbox visualization. You can input any mock numerical strings into the fields below to progress.
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Cardholder Name</label>
                <input type="text" [(ngModel)]="paymentData.cardName" name="cardName" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Card Number</label>
                <input type="text" placeholder="xxxx xxxx xxxx xxxx" [(ngModel)]="paymentData.cardNumber" name="cardNumber" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" [(ngModel)]="paymentData.expiry" name="expiry" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">CVV / Security Code</label>
                  <input type="password" placeholder="***" [(ngModel)]="paymentData.cvv" name="cvv" required class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" />
                </div>
              </div>

              <div class="pt-4 flex justify-between">
                <button type="button" (click)="prevStep()" class="px-6 py-3 bg-cinnamon-100 hover:bg-cinnamon-250 text-peppercorn-700 text-xs font-extrabold rounded-xl transition-all">Back</button>
                <button type="submit" [disabled]="!isPaymentValid()" class="px-8 py-3 bg-chili-600 hover:bg-chili-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:scale-103 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed">Review Order</button>
              </div>
            </form>
          }

          <!-- STEP 3: REVIEW DETAILS -->
          @if (currentStep() === 3) {
            <div class="space-y-6">
              <h3 class="text-lg font-bold font-display text-peppercorn-950 border-b border-cinnamon-50 pb-2">Final Review</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed font-semibold">
                <!-- Dest summary -->
                <div class="p-4 bg-cinnamon-50/50 border border-cinnamon-100 rounded-2xl space-y-1">
                  <h4 class="text-[10px] uppercase font-bold text-peppercorn-500 tracking-wider">Shipping Address</h4>
                  <p class="text-peppercorn-900">{{ shippingData.firstName }} {{ shippingData.lastName }}</p>
                  <p class="text-peppercorn-600">{{ shippingData.address }}</p>
                  <p class="text-peppercorn-600">{{ shippingData.city }}, {{ shippingData.zip }}</p>
                  <p class="text-peppercorn-600">{{ shippingData.country }}</p>
                  <p class="text-peppercorn-400 font-medium">Contact: {{ shippingData.email }}</p>
                </div>
                
                <!-- Payment summary -->
                <div class="p-4 bg-cinnamon-50/50 border border-cinnamon-100 rounded-2xl space-y-1">
                  <h4 class="text-[10px] uppercase font-bold text-peppercorn-500 tracking-wider">Payment Details</h4>
                  <p class="text-peppercorn-900">Cardholder: {{ paymentData.cardName }}</p>
                  <p class="text-peppercorn-600">Card ending in: **** {{ paymentData.cardNumber.slice(-4) }}</p>
                  <p class="text-peppercorn-400 font-medium">Standard Ground Courier Shipping</p>
                </div>
              </div>

              <!-- Cart summary table -->
              <div class="border border-cinnamon-100 rounded-2xl overflow-hidden text-xs">
                <div class="bg-cinnamon-50 p-3 font-bold text-peppercorn-950 uppercase tracking-wider text-[10px] grid grid-cols-3">
                  <span>Spice Item</span>
                  <span class="text-center">Quantity</span>
                  <span class="text-right">Price</span>
                </div>
                <div class="divide-y divide-cinnamon-100 bg-white">
                  @for (item of cartItems(); track item.product.id) {
                    <div class="p-3 grid grid-cols-3 items-center">
                      <span class="font-bold text-peppercorn-900">{{ item.product.name }}</span>
                      <span class="text-center font-medium text-peppercorn-600">{{ item.quantity }}</span>
                      <span class="text-right font-extrabold text-peppercorn-950">{{ (item.product.price * item.quantity) | currency }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Checkout summary box -->
              <div class="pt-4 border-t border-cinnamon-100 space-y-2 text-xs font-semibold text-peppercorn-600">
                <div class="flex justify-between">
                  <span>Subtotal</span>
                  <span>{{ subtotal() | currency }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Shipping</span>
                  <span>{{ shipping() === 0 ? 'FREE' : (shipping() | currency) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{{ tax() | currency }}</span>
                </div>
                <div class="flex justify-between text-base font-extrabold text-peppercorn-950 pt-2 border-t border-cinnamon-50">
                  <span>Grand Total</span>
                  <span>{{ total() | currency }}</span>
                </div>
              </div>

              <div class="pt-4 flex justify-between">
                <button (click)="prevStep()" class="px-6 py-3 bg-cinnamon-100 hover:bg-cinnamon-250 text-peppercorn-700 text-xs font-extrabold rounded-xl transition-all">Back</button>
                <button (click)="placeOrder()" class="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all hover:scale-103 active:scale-97">Place Order Details</button>
              </div>
            </div>
          }

          <!-- STEP 4: SUCCESS CONFIRMATION -->
          @if (currentStep() === 4) {
            <div class="text-center space-y-6 py-8 animate-scale-in">
              <!-- Checkmark circle animation container -->
              <div class="w-20 h-20 bg-emerald-50 border-4 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500 text-3xl font-extrabold animate-bounce">
                ✓
              </div>

              <div class="space-y-2">
                <span class="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Order Success</span>
                <h2 class="text-3xl font-extrabold font-display text-peppercorn-950">Sailing to Your Kitchen</h2>
                <p class="text-xs text-peppercorn-500 max-w-md mx-auto leading-relaxed">
                  Your spice selection has been secured and logged. A mock confirmation mail is flying to <span class="font-bold text-peppercorn-700">{{ shippingData.email }}</span>.
                </p>
              </div>

              <div class="max-w-xs mx-auto p-4 bg-cinnamon-50 border border-cinnamon-100 rounded-2xl text-left space-y-1.5 text-xs font-semibold">
                <div class="flex justify-between">
                  <span class="text-peppercorn-400">Order ID</span>
                  <span class="text-peppercorn-900 font-mono">#H-H-82937-26</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-peppercorn-400">Courier method</span>
                  <span class="text-peppercorn-900">Standard Estate Ground</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-peppercorn-400">Recipient</span>
                  <span class="text-peppercorn-900 truncate max-w-[120px]">{{ shippingData.firstName }} {{ shippingData.lastName }}</span>
                </div>
              </div>

              <div class="pt-6">
                <a 
                  routerLink="/shop" 
                  class="px-8 py-3.5 bg-chili-600 hover:bg-chili-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Return to Merchant Store
                </a>
              </div>
            </div>
          }

        </div>

      </div>
    </div>
  `
})
export class CheckoutComponent {
  private readonly cartService = inject(CartService);

  protected readonly currentStep = signal<number>(1);

  protected readonly cartItems = this.cartService.cartItems;
  protected readonly subtotal = this.cartService.cartSubtotal;
  protected readonly tax = this.cartService.cartTax;
  protected readonly shipping = this.cartService.cartShipping;
  protected readonly total = this.cartService.cartTotal;

  protected shippingData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  };

  protected paymentData = {
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  };

  isShippingValid(): boolean {
    return !!(
      this.shippingData.firstName &&
      this.shippingData.lastName &&
      this.shippingData.email &&
      this.shippingData.address &&
      this.shippingData.city &&
      this.shippingData.zip &&
      this.shippingData.country
    );
  }

  isPaymentValid(): boolean {
    return !!(
      this.paymentData.cardName &&
      this.paymentData.cardNumber &&
      this.paymentData.expiry &&
      this.paymentData.cvv
    );
  }

  nextStep() {
    this.currentStep.update(s => s + 1);
  }

  prevStep() {
    this.currentStep.update(s => Math.max(1, s - 1));
  }

  placeOrder() {
    // Clear shopping cart state and transition to final summary
    this.cartService.clearCart();
    this.currentStep.set(4);
  }
}
