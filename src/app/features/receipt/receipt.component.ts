import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockUserService, Order } from '../../core/services/mock-user.service';
import { MockAuthService } from '../../core/services/mock-auth.service';
import { ActivityTrackingService } from '../../core/services/activity-tracking.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-sage-50/50 pt-28 pb-16 no-print flex flex-col items-center">
      <!-- Action Buttons Row -->
      <div class="w-full max-w-[210mm] mb-6 flex flex-col sm:flex-row justify-between items-center px-4 md:px-0 gap-3">
        <a routerLink="/profile" class="text-xs font-bold text-moss-700 hover:text-moss-900 flex items-center gap-1">
          ← Back to Account Profile
        </a>
        <div class="flex gap-3">
          <button (click)="printReceipt()" class="px-4 py-2 bg-sage-100 hover:bg-sage-200 text-peppercorn-900 text-xs font-bold rounded-xl shadow-2xs border border-sage-250 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <span>🖨️</span> Print Receipt
          </button>
          <button (click)="downloadPDF()" class="px-4 py-2 bg-moss-600 hover:bg-moss-500 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <span>📥</span> Download A4 PDF
          </button>
        </div>
      </div>

      <!-- A4 Page Container (Screen Visualizer) -->
      <div 
        id="receipt-print-area" 
        class="w-[210mm] min-h-[297mm] bg-white border border-sage-200/60 shadow-xl p-[20mm] flex flex-col justify-between text-peppercorn-900 select-text relative font-sans leading-relaxed box-border"
      >
        <!-- TOP OF RECEIPT -->
        <div>
          <!-- HEADER -->
          <div class="flex justify-between items-start border-b-2 border-moss-800/10 pb-6 mb-8 flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🌿</span>
                <span class="font-display font-extrabold text-2xl tracking-wide text-moss-800 uppercase">Sasya Spice Co.</span>
              </div>
              <span class="text-[9px] text-peppercorn-400 font-bold uppercase tracking-widest block">Organic Apothecary Vaults</span>
              <p class="text-[10px] text-peppercorn-500 font-semibold mt-1">
                400 Cardamom Spice Route<br/>
                Cochin, Kerala 682001, India<br/>
                support@sasya.app | www.sasya.app
              </p>
            </div>
            <div class="text-right">
              <h1 class="font-display font-extrabold text-3xl text-peppercorn-950 uppercase tracking-wider mb-2">Invoice Receipt</h1>
              <table class="text-[10px] font-semibold text-peppercorn-650 border-collapse ml-auto">
                <tr>
                  <td class="text-peppercorn-400 font-bold uppercase tracking-wider pr-3 py-0.5 text-right">Invoice No:</td>
                  <td class="text-peppercorn-950 font-mono font-bold text-left">{{ order()?.id?.replace('#', '') }}</td>
                </tr>
                <tr>
                  <td class="text-peppercorn-400 font-bold uppercase tracking-wider pr-3 py-0.5 text-right">Date:</td>
                  <td class="text-peppercorn-950 text-left">{{ order()?.date }}</td>
                </tr>
                <tr>
                  <td class="text-peppercorn-400 font-bold uppercase tracking-wider pr-3 py-0.5 text-right">Status:</td>
                  <td class="text-emerald-700 font-bold uppercase tracking-wider text-left">{{ order()?.status }}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- CUSTOMER DETAILS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-sage-50/20 border border-sage-100/50 rounded-xl p-5 mb-8 text-[11px] leading-relaxed">
            <div>
              <span class="text-[9px] text-peppercorn-400 font-bold uppercase tracking-widest block mb-1">Customer Billing Info:</span>
              <h3 class="font-bold text-peppercorn-950 text-xs mb-0.5">{{ user()?.name || 'Guest Buyer' }}</h3>
              <p class="text-peppercorn-600 font-medium">
                {{ user()?.email }}<br/>
                {{ user()?.phone || 'No phone provided' }}
              </p>
            </div>
            <div>
              <span class="text-[9px] text-peppercorn-400 font-bold uppercase tracking-widest block mb-1">Shipping Destination:</span>
              <p class="text-peppercorn-700 font-semibold">
                {{ order()?.shippingAddress }}
              </p>
            </div>
          </div>

          <!-- ITEM LIST TABLE -->
          <div class="mb-8">
            <table class="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr class="border-b border-peppercorn-200 text-[9px] font-bold text-peppercorn-400 uppercase tracking-widest">
                  <th class="py-2.5 text-left">Spice Cargo Product</th>
                  <th class="py-2.5 text-center w-16">Qty</th>
                  <th class="py-2.5 text-right w-24">Unit Price</th>
                  <th class="py-2.5 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-peppercorn-100 text-peppercorn-800 font-medium">
                @for (item of order()?.items; track item.productId) {
                  <tr>
                    <td class="py-3">
                      <div class="flex items-center gap-3">
                        <img [src]="item.image" class="w-7 h-7 object-cover rounded bg-sage-50 border border-sage-100/50 print:hidden" />
                        <div>
                          <h4 class="font-bold text-peppercorn-950">{{ item.name }}</h4>
                          <span class="text-[8px] text-peppercorn-400 uppercase tracking-wide">ID: {{ item.productId }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 text-center text-peppercorn-950 font-mono">{{ item.quantity }}</td>
                    <td class="py-3 text-right text-peppercorn-600">{{ item.price | currency }}</td>
                    <td class="py-3 text-right text-peppercorn-950 font-bold">{{ (item.price * item.quantity) | currency }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- SUMMARY BLOCK -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8 border-t border-peppercorn-100 pt-6">
            <!-- Payment details & policy -->
            <div class="space-y-4 text-[10px]">
              <div>
                <span class="text-[9px] text-peppercorn-400 font-bold uppercase tracking-widest block mb-1">Payment Method:</span>
                <div class="flex items-center gap-1.5 text-peppercorn-700 font-semibold">
                  <span>💳</span>
                  <span>Credit Card ending in **** 1234 (Mocked Authorization)</span>
                </div>
              </div>
              <div class="text-peppercorn-500 font-medium leading-relaxed">
                <span class="text-[9px] text-peppercorn-400 font-bold uppercase tracking-widest block mb-1">Apothecary Return Policy:</span>
                Due to food safety and aroma preservation, raw spices are non-refundable. If shipping seals are damaged upon delivery, please contact our Cochin support terminal immediately.
              </div>
            </div>

            <!-- Price breakdown -->
            <div class="bg-sage-50/10 border border-sage-100/30 rounded-xl p-4 ml-auto w-full md:w-80 text-[11px] font-semibold text-peppercorn-600 space-y-2">
              <div class="flex justify-between">
                <span>Items Subtotal:</span>
                <span class="text-peppercorn-950 font-mono">{{ subtotal() | currency }}</span>
              </div>
              @if (discountAmount() > 0) {
                <div class="flex justify-between text-emerald-700">
                  <span>Promo Discount ({{ order()?.appliedPromo }} - 25%):</span>
                  <span class="font-mono">-{{ discountAmount() | currency }}</span>
                </div>
              }
              <div class="flex justify-between">
                <span>Shipping & Handling:</span>
                <span class="text-peppercorn-950 font-mono">{{ shippingCost() | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span>Sales Tax (8%):</span>
                <span class="text-peppercorn-950 font-mono">{{ taxAmount() | currency }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-peppercorn-200 text-peppercorn-950 text-xs font-bold bg-moss-50/20 -mx-4 px-4 py-2 rounded-b-xl">
                <span class="text-moss-800 uppercase tracking-widest font-extrabold text-[10px]">Grand Total Paid:</span>
                <span class="font-extrabold font-mono text-moss-850 text-sm">{{ order()?.total | currency }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BOTTOM OF RECEIPT (QR CODE & SIGNATURES) -->
        <div class="border-t border-peppercorn-100 pt-6 mt-8 flex justify-between items-end flex-wrap gap-4">
          <!-- QR CODE -->
          <div class="flex items-center gap-3">
            @if (qrCodeDataUrl()) {
              <img [src]="qrCodeDataUrl()" class="w-18 h-18 bg-white border border-sage-200 p-1 rounded-lg" alt="Receipt verification QR code" />
            }
            <div class="text-[9px] text-peppercorn-400 font-bold tracking-wide uppercase leading-tight space-y-1">
              <span>Scan to view this<br/>receipt online</span>
              <span class="text-[7.5px] text-moss-700 underline font-mono block select-none">https://sasya.app/receipt/{{ order()?.id }}</span>
            </div>
          </div>

          <!-- DIGITAL SIGNATURE BLOCK -->
          <div class="text-right space-y-2">
            <div class="pr-2">
              <!-- Cursive Signature -->
              <span class="font-display italic text-2xl font-semibold text-moss-700 select-none block tracking-wide">
                Sasya Team Apothecaries
              </span>
              <!-- Simple signature underline SVG -->
              <svg class="w-44 h-2.5 ml-auto text-sage-300" viewBox="0 0 200 10" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M5 6 C 35 2, 90 7, 130 3 C 160 1, 185 5, 195 3" stroke-linecap="round" />
              </svg>
            </div>
            <div class="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-105 px-2.5 py-1 rounded-lg text-emerald-800">
              <span class="text-[9px] text-emerald-500 font-extrabold">✔</span>
              <div class="text-left text-[8px] leading-tight font-extrabold uppercase tracking-widest">
                <div>Digitally Signed by Sasya</div>
                <div class="text-emerald-600/70 text-[7px] font-mono mt-0.5">Verified SECURE on {{ order()?.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Host rule ensures print styling applies correctly */
    :host {
      display: block;
    }

    /* Print styling rules */
    @media print {
      .no-print {
        display: none !important;
      }
      
      #receipt-print-area {
        width: 100% !important;
        height: auto !important;
        min-height: 100% !important;
        border: none !important;
        box-shadow: none !important;
        padding: 15mm !important;
        margin: 0 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        box-sizing: border-box !important;
      }
    }
  `]
})
export class ReceiptComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(MockUserService);
  private readonly authService = inject(MockAuthService);
  private readonly activityService = inject(ActivityTrackingService);

  // States
  protected readonly order = signal<Order | null>(null);
  protected readonly user = this.authService.currentUser;
  protected readonly qrCodeDataUrl = signal<string>('');

  // Math Computeds
  protected readonly subtotal = computed(() => {
    const o = this.order();
    if (!o) return 0;
    return o.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  protected readonly discountAmount = computed(() => {
    const o = this.order();
    if (!o || !o.appliedPromo) return 0;
    // Standard promo code discount is 25%
    return this.subtotal() * 0.25;
  });

  protected readonly shippingCost = computed(() => {
    const o = this.order();
    if (!o) return 0;
    // Flat shipping rate of $5.00
    return 5.00;
  });

  protected readonly taxAmount = computed(() => {
    return (this.subtotal() - this.discountAmount()) * 0.08;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('orderId');
      if (orderId) {
        // Find order
        const orders = this.userService.orders();
        const matched = orders.find(o => o.id === orderId || o.id.replace('#', '') === orderId);
        if (matched) {
          this.order.set(matched);
          this.generateQRCode(matched.id);
          this.activityService.track('VIEW_RECEIPT', `Viewed invoice receipt: ${matched.id}`, { orderId: matched.id });
        }
      }
    });
  }

  private generateQRCode(orderId: string) {
    if (typeof window !== 'undefined') {
      // Encode back to this receipt route
      const receiptUrl = `${window.location.protocol}//${window.location.host}/receipt/${orderId.replace('#', '')}`;
      QRCode.toDataURL(receiptUrl, { 
        margin: 1, 
        width: 150,
        color: {
          dark: '#1e1e1c', // peppercorn-900 color
          light: '#ffffff'
        }
      })
      .then(url => {
        this.qrCodeDataUrl.set(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
    }
  }

  printReceipt() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  downloadPDF() {
    const element = document.getElementById('receipt-print-area');
    const orderVal = this.order();
    if (!element || !orderVal) return;

    // Use html2canvas to render receipt to image, then output to A4 jsPDF
    html2canvas(element, { 
      scale: 2.5, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 dimensions: 210mm width, 297mm height
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if receipt content overflows one page (highly unlikely for standard invoices)
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `sasya-receipt-${orderVal.id.replace('#', '')}.pdf`;
      pdf.save(fileName);
      this.activityService.track('DOWNLOAD_RECEIPT', `Downloaded invoice PDF: ${orderVal.id}`, { orderId: orderVal.id });
    });
  }
}
