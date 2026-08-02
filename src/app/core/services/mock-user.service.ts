import { Injectable, signal, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, PRODUCTS } from '../mock-data/data';
import { ActivityTrackingService } from './activity-tracking.service';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderHistoryStep {
  status: 'Placed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'Placed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  currentStep: number;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
  courier: string;
  trackingNumber: string;
  history: OrderHistoryStep[];
  appliedPromo?: string;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  private readonly activityService = inject(ActivityTrackingService);
  private readonly LATENCY_MS = 250;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sasya_mock_orders');
        if (saved) {
          this.orders.set(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to parse orders from localStorage', e);
      }
    }
  }

  private saveOrders(ordersList: Order[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sasya_mock_orders', JSON.stringify(ordersList));
      } catch (e) {
        console.error('Failed to save orders to localStorage', e);
      }
    }
  }

  // Signal arrays for live mutation
  readonly wishlist = signal<Product[]>([
    PRODUCTS[0], // Kampot Pepper
    PRODUCTS[4], // Aleppo Flakes
  ]);

  readonly addresses = signal<Address[]>([
    {
      id: 'addr_1',
      label: 'Home (Default)',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      address: '448 Ochre Clay Lane',
      city: 'Santa Fe',
      zip: '87501',
      country: 'USA'
    },
    {
      id: 'addr_2',
      label: 'Office',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      address: '12 Artisan Wharf, Suite 300',
      city: 'Seattle',
      zip: '98101',
      country: 'USA'
    }
  ]);

  readonly orders = signal<Order[]>([
    {
      id: '#H-H-98834-21',
      date: 'Aug 01, 2026',
      items: [
        { productId: 'prod_4', name: 'Imperial Saffron Threads', quantity: 1, price: 34.00, image: '/images/saffron-1.png' }
      ],
      status: 'Shipped',
      currentStep: 3,
      total: 34.00,
      shippingAddress: '448 Ochre Clay Lane, Santa Fe, 87501, USA',
      estimatedDelivery: 'Aug 05, 2026',
      courier: 'SpicePost Express',
      trackingNumber: 'SPX-9828472-US',
      history: [
        { status: 'Placed', timestamp: '2026-08-01T08:00:00Z', note: 'Order placed successfully by buyer.' },
        { status: 'Processing', timestamp: '2026-08-01T10:30:00Z', note: 'Spice bundles checked out from primary vault.' },
        { status: 'Packed', timestamp: '2026-08-01T14:00:00Z', note: 'Packaged in sealed aroma-preserving crates.' },
        { status: 'Shipped', timestamp: '2026-08-02T09:00:00Z', note: 'Handed over to courier. Cargo transit in progress.' }
      ]
    },
    {
      id: '#H-H-98127-14',
      date: 'Jul 15, 2026',
      items: [
        { productId: 'prod_1', name: 'Kampot Black Peppercorns', quantity: 1, price: 18.50, image: '/images/kampot-1.png' },
        { productId: 'prod_2', name: 'Vibrant Kashmiri Chili', quantity: 1, price: 12.90, image: '/images/kashmiri-1.png' }
      ],
      status: 'Delivered',
      currentStep: 5,
      total: 31.40,
      shippingAddress: '448 Ochre Clay Lane, Santa Fe, 87501, USA',
      estimatedDelivery: 'Jul 18, 2026',
      courier: 'Apothecary Air Cargo',
      trackingNumber: 'AAC-2837492-US',
      history: [
        { status: 'Placed', timestamp: '2026-07-15T09:00:00Z', note: 'Placed.' },
        { status: 'Processing', timestamp: '2026-07-15T11:00:00Z', note: 'Processing.' },
        { status: 'Packed', timestamp: '2026-07-15T16:00:00Z', note: 'Packed.' },
        { status: 'Shipped', timestamp: '2026-07-16T10:00:00Z', note: 'Shipped.' },
        { status: 'Out for Delivery', timestamp: '2026-07-18T08:30:00Z', note: 'Out for Delivery.' },
        { status: 'Delivered', timestamp: '2026-07-18T14:15:00Z', note: 'Delivered.' }
      ]
    },
    {
      id: '#H-H-97210-09',
      date: 'May 22, 2026',
      items: [
        { productId: 'prod_8', name: 'Grand Spice Merchant Cabinet', quantity: 1, price: 95.00, image: '/images/cabinet-1.png' }
      ],
      status: 'Delivered',
      currentStep: 5,
      total: 95.00,
      shippingAddress: '12 Artisan Wharf, Suite 300, Seattle, 98101, USA',
      estimatedDelivery: 'May 25, 2026',
      courier: 'Apothecary Air Cargo',
      trackingNumber: 'AAC-1827409-US',
      history: [
        { status: 'Placed', timestamp: '2026-05-22T10:00:00Z', note: 'Placed.' },
        { status: 'Processing', timestamp: '2026-05-22T13:00:00Z', note: 'Processing.' },
        { status: 'Packed', timestamp: '2026-05-22T17:00:00Z', note: 'Packed.' },
        { status: 'Shipped', timestamp: '2026-05-23T09:00:00Z', note: 'Shipped.' },
        { status: 'Out for Delivery', timestamp: '2026-05-25T08:00:00Z', note: 'Out for Delivery.' },
        { status: 'Delivered', timestamp: '2026-05-25T11:30:00Z', note: 'Delivered.' }
      ]
    }
  ]);

  // Wishlist Actions
  toggleWishlist(product: Product) {
    this.wishlist.update(list => {
      const exists = list.find(p => p.id === product.id);
      if (exists) {
        this.activityService.track('TOGGLE_WISHLIST', `Removed ${product.name} from Wishlist Shelf`, { productId: product.id });
        return list.filter(p => p.id !== product.id);
      }
      this.activityService.track('TOGGLE_WISHLIST', `Saved ${product.name} to Wishlist Shelf`, { productId: product.id });
      return [...list, product];
    });
  }

  isInWishlist(productId: string): boolean {
    return !!this.wishlist().find(p => p.id === productId);
  }

  // Address Actions
  addAddress(address: Omit<Address, 'id'>) {
    const newAddr: Address = {
      ...address,
      id: `addr_${Date.now()}`
    };
    this.addresses.update(addrs => [...addrs, newAddr]);
    this.activityService.track('ADD_ADDRESS', `Added shipping address: ${newAddr.label}`, { address: newAddr });
  }

  deleteAddress(id: string) {
    const addr = this.addresses().find(a => a.id === id);
    const label = addr ? addr.label : id;
    this.addresses.update(addrs => addrs.filter(a => a.id !== id));
    this.activityService.track('DELETE_ADDRESS', `Deleted shipping address: ${label}`, { addressId: id });
  }

  // Settings mock actions
  updateNotificationSettings(settings: any): Observable<boolean> {
    return of(true).pipe(delay(this.LATENCY_MS));
  }

  // Order Actions
  addOrder(order: Order) {
    this.orders.update(currentOrders => {
      const updated = [order, ...currentOrders];
      this.saveOrders(updated);
      return updated;
    });
  }

  advanceOrderStatus(orderId: string) {
    const STAGES: Order['status'][] = ['Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    
    this.orders.update(currentOrders => {
      const updated = currentOrders.map(order => {
        if (order.id === orderId) {
          if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return order;
          }
          const nextIndex = Math.min(STAGES.length - 1, order.currentStep + 1);
          const nextStatus = STAGES[nextIndex];
          
          let note = '';
          switch(nextStatus) {
            case 'Processing':
              note = 'Crate assigned. Spices verified for packaging.';
              break;
            case 'Packed':
              note = 'Aroma-sealed box packed and inspected.';
              break;
            case 'Shipped':
              note = 'Crate loaded onto spice transport vehicle.';
              break;
            case 'Out for Delivery':
              note = 'Spice runner is en route to local address.';
              break;
            case 'Delivered':
              note = 'Delivered directly to customer kitchen vault.';
              break;
            default:
              note = `Status advanced to ${nextStatus}.`;
          }

          const newHistoryStep: OrderHistoryStep = {
            status: nextStatus,
            timestamp: new Date().toISOString(),
            note
          };

          return {
            ...order,
            status: nextStatus,
            currentStep: nextIndex,
            history: [...order.history, newHistoryStep]
          };
        }
        return order;
      });
      this.saveOrders(updated);
      return updated;
    });
  }
}
