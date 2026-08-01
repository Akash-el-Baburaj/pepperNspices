import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockAuthService } from '../../core/services/mock-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-cinnamon-50 pt-32 pb-24 flex items-center justify-center">
      <div class="max-w-4xl w-full mx-auto px-4">
        
        <!-- SPLIT PANEL CARD -->
        <div class="bg-white border border-cinnamon-100 rounded-3xl overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          
          <!-- LEFT COLUMN: IMAGE BRAND BOARD -->
          <div class="relative hidden md:block bg-peppercorn-950 overflow-hidden select-none">
            <div 
              class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
              style="background-image: url('/images/spices-hero-bg.png');"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-peppercorn-950 via-peppercorn-950/30 to-transparent"></div>
            
            <div class="absolute inset-0 p-10 flex flex-col justify-between text-white z-10">
              <span class="text-xs font-extrabold uppercase tracking-widest text-saffron-400">Haldi & Horn</span>
              
              <div class="space-y-4">
                <h2 class="text-3xl font-bold font-display leading-tight">Welcome Back, Chef</h2>
                <p class="text-xs text-cinnamon-100 leading-relaxed font-medium">
                  Login to load your saved addresses, browse past spice crates, and manage your apothecary subscriptions.
                </p>
              </div>

              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">EST. 2026 / CULINARY PURITY</span>
            </div>
          </div>

          <!-- RIGHT COLUMN: FORM PANEL -->
          <div class="p-8 md:p-12 flex flex-col justify-center bg-kraft-paper relative">
            <div class="mb-6">
              <h1 class="text-2xl font-extrabold text-peppercorn-950 font-display">Apothecary Sign In</h1>
              <p class="text-xs text-peppercorn-500 font-medium mt-1">Access your single-origin vault.</p>
            </div>

            <!-- Error message alert -->
            @if (errorMessage()) {
              <div class="p-3 bg-chili-50 border border-chili-200 text-chili-700 text-xs font-bold rounded-xl mb-4">
                ⚠ {{ errorMessage() }}
              </div>
            }

            <form (submit)="onSubmit()" class="space-y-4">
              <!-- Email -->
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Email Address</label>
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  name="email" 
                  required
                  class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" 
                />
              </div>

              <!-- Password -->
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label class="text-[10px] font-bold text-peppercorn-500 uppercase">Password</label>
                  <a href="#" (click)="onForgotPassword($event)" class="text-[10px] font-bold text-chili-600 hover:text-chili-700 underline">Forgot?</a>
                </div>
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  name="password" 
                  required
                  class="w-full text-xs font-semibold px-4 py-3 bg-cinnamon-50/50 border border-cinnamon-100 rounded-xl focus:outline-none focus:border-chili-500 transition-colors" 
                />
              </div>

              <!-- Remember Me -->
              <div class="flex items-center gap-2 py-1 select-none">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  [(ngModel)]="rememberMe"
                  name="rememberMe"
                  class="w-4 h-4 rounded-md border-cinnamon-300 text-chili-600 focus:ring-chili-500/20 cursor-pointer"
                />
                <label for="rememberMe" class="text-xs text-peppercorn-500 font-bold cursor-pointer">Remember my login session</label>
              </div>

              <button 
                type="submit" 
                [disabled]="isSubmitting() || !isFormValid()"
                class="w-full py-3.5 bg-chili-600 hover:bg-chili-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-103 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                @if (isSubmitting()) {
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Credentials...</span>
                } @else {
                  <span>Sign In</span>
                }
              </button>
            </form>

            <!-- Social (UI only) -->
            <div class="relative flex items-center justify-center my-6">
              <span class="absolute w-full border-t border-cinnamon-100"></span>
              <span class="relative bg-white px-3 text-[9px] font-bold text-peppercorn-400 uppercase tracking-widest">Or sign in with</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button type="button" class="flex items-center justify-center gap-2 py-2 px-4 border border-cinnamon-100 rounded-xl text-xs font-semibold text-peppercorn-700 bg-white hover:bg-cinnamon-50 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 1.84 14.93 1 12 1 7.35 1 3.39 3.67 1.41 7.56l3.77 2.92c.9-2.7 3.42-4.44 6.82-4.44z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"/><path fill="#FBBC05" d="M5.18 10.48A7.07 7.07 0 014.8 12c0 .52.07 1.04.18 1.54l-3.77 2.92C.44 14.86 0 13.48 0 12c0-1.48.44-2.86 1.21-4.46l3.97 2.94z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.03.69-2.35 1.1-4.23 1.1-3.4 0-5.92-1.74-6.82-4.44l-3.77 2.92C3.39 20.33 7.35 23 12 23z"/></svg>
                <span>Google</span>
              </button>
              <button type="button" class="flex items-center justify-center gap-2 py-2 px-4 border border-cinnamon-100 rounded-xl text-xs font-semibold text-peppercorn-700 bg-white hover:bg-cinnamon-50 transition-colors">
                <svg class="w-4 h-4 fill-current text-peppercorn-900" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                <span>GitHub</span>
              </button>
            </div>

            <!-- Signup footer link -->
            <p class="text-xs text-peppercorn-500 font-medium text-center mt-6">
              New to Haldi & Horn? 
              <a routerLink="/register" class="font-bold text-chili-600 hover:text-chili-700 underline">Create account</a>.
            </p>
          </div>

        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(MockAuthService);
  private readonly router = inject(Router);

  // Form Fields
  protected email = '';
  protected password = '';
  protected rememberMe = false;

  // Form states
  protected isSubmitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  isFormValid(): boolean {
    return !!(
      this.email.trim() &&
      this.email.includes('@') &&
      this.password.trim()
    );
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    
    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Credentials invalid. Try again.');
      }
    });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    alert('Mock: Password reset link has been dispatched to your email.');
  }
}
