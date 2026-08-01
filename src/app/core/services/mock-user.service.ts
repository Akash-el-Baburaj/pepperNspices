import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, PRODUCTS } from '../mock-data/data';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'Delivered' | 'In Transit' | 'Processing';
  total: number;
  shippingAddress: string;
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
  private readonly LATENCY_MS = 250;

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
      status: 'In Transit',
      total: 34.00,
      shippingAddress: '448 Ochre Clay Lane, Santa Fe, 87501, USA'
    },
    {
      id: '#H-H-98127-14',
      date: 'Jul 15, 2026',
      items: [
        { productId: 'prod_1', name: 'Kampot Black Peppercorns', quantity: 1, price: 18.50, image: '/images/kampot-1.png' },
        { productId: 'prod_2', name: 'Vibrant Kashmiri Chili', quantity: 1, price: 12.90, image: '/images/kashmiri-1.png' }
      ],
      status: 'Delivered',
      total: 31.40,
      shippingAddress: '448 Ochre Clay Lane, Santa Fe, 87501, USA'
    },
    {
      id: '#H-H-97210-09',
      date: 'May 22, 2026',
      items: [
        { productId: 'prod_8', name: 'Grand Spice Merchant Cabinet', quantity: 1, price: 95.00, image: '/images/cabinet-1.png' }
      ],
      status: 'Delivered',
      total: 95.00,
      shippingAddress: '12 Artisan Wharf, Suite 300, Seattle, 98101, USA'
    }
  ]);

  // Wishlist Actions
  toggleWishlist(product: Product) {
    this.wishlist.update(list => {
      const exists = list.find(p => p.id === product.id);
      if (exists) {
        return list.filter(p => p.id !== product.id);
      }
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
  }

  deleteAddress(id: string) {
    this.addresses.update(addrs => addrs.filter(a => a.id !== id));
  }

  // Settings mock actions
  updateNotificationSettings(settings: any): Observable<boolean> {
    return of(true).pipe(delay(this.LATENCY_MS));
  }
}
