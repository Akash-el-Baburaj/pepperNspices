import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivityTrackingService } from './activity-tracking.service';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private readonly router = inject(Router);
  private readonly activityService = inject(ActivityTrackingService);

  // Core signals for auth state
  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Check if we already have a mock session in localStorage (for page refreshes)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('spice_mock_user');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulate API verification call
    return of(true).pipe(
      delay(400),
      tap(() => {
        const mockUser: User = {
          id: 'user_1',
          name: 'Sarah Jenkins',
          email: email || 'sarah.j@example.com',
          phone: '+1 (555) 342-9821',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
        };
        this.currentUser.set(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('spice_mock_user', JSON.stringify(mockUser));
        }
        this.activityService.track('LOGIN', `Logged in as ${mockUser.name} (${mockUser.email})`, { email: mockUser.email });
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    // Simulate API registration call
    return of(true).pipe(
      delay(450),
      tap(() => {
        const mockUser: User = {
          id: 'user_1',
          name: name || 'New Merchant User',
          email: email || 'newuser@example.com',
          phone: '',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'
        };
        this.currentUser.set(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('spice_mock_user', JSON.stringify(mockUser));
        }
        this.activityService.track('REGISTER', `Registered new merchant: ${mockUser.name} (${mockUser.email})`, { name: mockUser.name, email: mockUser.email });
      })
    );
  }

  logout() {
    const user = this.currentUser();
    const emailLabel = user ? `${user.name} (${user.email})` : 'unknown user';
    
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spice_mock_user');
    }
    this.activityService.track('LOGOUT', `Logged out from apothecary account: ${emailLabel}`);
    this.router.navigate(['/']);
  }
}
