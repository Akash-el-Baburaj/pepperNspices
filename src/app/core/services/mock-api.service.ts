import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, Category, Testimonial, PRODUCTS, CATEGORIES, TESTIMONIALS } from '../mock-data/data';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly LATENCY_MS = 300;

  getProducts(): Observable<Product[]> {
    return of(PRODUCTS).pipe(delay(this.LATENCY_MS));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(PRODUCTS.find(p => p.id === id)).pipe(delay(this.LATENCY_MS));
  }

  getCategories(): Observable<Category[]> {
    return of(CATEGORIES).pipe(delay(this.LATENCY_MS));
  }

  getTestimonials(): Observable<Testimonial[]> {
    return of(TESTIMONIALS).pipe(delay(this.LATENCY_MS));
  }

  getFeaturedProducts(): Observable<Product[]> {
    // Return Kampot, Kashmiri, Saffron, and Aleppo
    const featuredIds = ['prod_1', 'prod_2', 'prod_4', 'prod_5'];
    return of(PRODUCTS.filter(p => featuredIds.includes(p.id))).pipe(delay(this.LATENCY_MS));
  }
}
